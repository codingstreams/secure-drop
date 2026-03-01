import React, { useState, useEffect } from 'react';
import { RefreshCw, FileWarning, Inbox } from 'lucide-react';
import FileDetails from '../components/FileDetails';
import type { FileResponseDto } from '../api/types/dto';
import { UserFileServiceImpl } from '../api/services/user-file/UserFileServiceImpl';


const FilesScreen: React.FC = () => {
  // Now managing the content array from the paginated response
  const [files, setFiles] = useState<FileResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      // UserFileService.listAllFiles returns PageFileResponseDto
      // Defaulting to page 0, size 20 as per your previous logic
      const data = await UserFileServiceImpl.listAllFiles(0, 50, ['expiresAt,desc']);

      // We extract the 'content' array for the UI
      setFiles(data.content);
    } catch (err: any) {
      // Robust error message extraction
      const message = err.response?.data?.message || err.message || 'Failed to sync with secure server';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="w-full max-w-5xl h-full flex flex-col gap-6 animate-in fade-in duration-500 px-6">
      {/* Header Section */}
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-glow uppercase">
            Vault<span className="text-ghost-primary">_Files</span>
          </h2>
          <p className="text-ghost-accent text-xs font-mono uppercase tracking-widest">
            {files.length} Records Decrypted
          </p>
        </div>
        <button
          onClick={fetchFiles}
          disabled={loading}
          className="p-2 rounded-lg bg-ghost-surface shadow-neo-flat active:shadow-neo-pressed text-ghost-primary hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">

          {/* Error State */}
          {error && (
            <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-4 shadow-neo-flat">
              <FileWarning className="w-8 h-8 flex-shrink-0" />
              <div>
                <p className="font-bold uppercase text-sm">System Breach/Error</p>
                <p className="text-xs opacity-80">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State (Skeleton UI) */}
          {loading && !files.length && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 w-full bg-ghost-surface/50 rounded-xl animate-pulse border border-white/5" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && files.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center h-64 text-ghost-accent opacity-40">
              <Inbox className="w-12 h-12 mb-2" />
              <p className="font-mono text-sm tracking-widest uppercase">Vault is Empty</p>
            </div>
          )}

          {/* Files List */}
          <ul className="space-y-4 pb-8">
            {files.map((file) => (
              <li
                key={file.accessCode}
                className="group relative transition-all duration-300"
              >
                <div className="absolute -inset-0.5 bg-ghost-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative p-4 bg-ghost-surface rounded-xl shadow-neo-flat hover:shadow-neo-pressed border border-white/5 transition-all">
                  {/* Passing the correct DTO to FileDetails */}
                  <FileDetails fileInfo={file} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FilesScreen;