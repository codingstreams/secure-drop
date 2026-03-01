import { Clock, Globe, Download, ExternalLink, LockIcon, FileIcon } from "lucide-react";
import { StorageMode, type FileResponseDto } from "../api/types/dto";

interface FileDetailsProps {
  fileInfo: FileResponseDto;
}

const FileDetails: React.FC<FileDetailsProps> = ({ fileInfo }) => {
  // Calculate if the file is expiring soon (less than 24 hours)
  const expiryDate = new Date(fileInfo.expiresAt);
  const isExpiringSoon = (expiryDate.getTime() - Date.now()) < 86400000;

  // Formatter for file size (bytes to KB/MB)
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex items-center justify-between gap-4 group/item">
      {/* 1. File Icon & Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="hidden sm:flex p-3 bg-ghost-bg rounded-lg border border-white/5 text-ghost-accent group-hover/item:text-ghost-primary transition-colors relative">
          <FileIcon className="w-6 h-6" />
          {/* Status Indicator Dot */}
          <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${fileInfo.mode === StorageMode.PUBLIC_POOL ? 'bg-blue-400' : 'bg-emerald-400'
            }`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm md:text-base font-bold text-ghost-text truncate group-hover/item:text-glow transition-all">
              {fileInfo.fileName}
            </h4>
            <span className="text-[10px] text-ghost-accent font-mono opacity-60">
              ({formatSize(fileInfo.fileSize)})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
            {/* Expiry Badge */}
            <div className={`flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase ${isExpiringSoon ? 'text-orange-400' : 'text-ghost-accent'
              }`}>
              <Clock className="w-3 h-3" />
              <span>Expires: {expiryDate.toLocaleDateString()}</span>
            </div>

            {/* Visibility/Security Badge */}
            <div className={`flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase ${fileInfo.mode === StorageMode.PUBLIC_POOL ? 'text-blue-400' : 'text-emerald-500/80'
              }`}>
              {fileInfo.mode === StorageMode.PUBLIC_POOL ? (
                <>
                  <Globe className="w-3 h-3" />
                  <span>Public Pool</span>
                </>
              ) : (
                <>
                  <LockIcon className="w-3 h-3" />
                  <span>Private Vault</span>
                </>
              )}
            </div>

            {/* Download Counter */}
            <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-ghost-accent">
              <span className="opacity-60">DL:</span>
              <span>{fileInfo.currentDownloads} / {fileInfo.maxDownloads}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Actions */}
      <div className="flex items-center gap-2">
        {fileInfo.accessCode && (
          <span className="hidden lg:block font-mono text-[10px] bg-ghost-bg px-2 py-1 rounded border border-white/5 text-ghost-accent">
            ID: {fileInfo.accessCode}
          </span>
        )}

        {/* Download Action - Link to the download endpoint */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(fileInfo.shareUrl, '_blank');
          }}
          className="p-2.5 rounded-lg bg-ghost-bg hover:bg-ghost-primary/10 border border-white/5 text-ghost-accent hover:text-ghost-primary transition-all shadow-neo-flat active:shadow-neo-pressed"
          title="Download File"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Copy Share Link */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(fileInfo.shareUrl);
            // Hint: Trigger your toast notification here
          }}
          className="p-2.5 rounded-lg bg-ghost-bg hover:bg-ghost-primary/10 border border-white/5 text-ghost-accent hover:text-ghost-primary transition-all shadow-neo-flat active:shadow-neo-pressed"
          title="Copy Link"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FileDetails;