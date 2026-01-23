import { useState, useRef } from 'react';
import { X, Upload, Loader2, Type } from 'lucide-react';
import handoutService from '@/services/handoutService';

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: (url: string, caption: string) => void;
}

const ImageUploadModal = ({ isOpen, onClose, onUploadSuccess }: ImageUploadModalProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const data = await handoutService.uploadAttachment(file, caption, caption);
            onUploadSuccess(data.file_url, caption);
            setFile(null);
            setCaption('');
            onClose();
        } catch (error) {
            alert("Upload failed: " + (error as any).message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-base-100 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <div className="p-6 border-b border-base-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Upload size={20} className="text-accent" /> UPLOAD IMAGE
                    </h3>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-square"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-6">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${file ? 'border-accent bg-accent/5' : 'border-base-300 hover:border-accent/50'}`}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        {file ? (
                            <span className="text-sm font-medium text-accent truncate max-w-full">{file.name}</span>
                        ) : (
                            <>
                                <Upload size={32} className="opacity-20 mb-2" />
                                <span className="text-xs font-bold opacity-40 uppercase">Click to select image</span>
                            </>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black opacity-40 uppercase tracking-widest flex items-center gap-1">
                            <Type size={12} /> Image Caption
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full font-medium"
                            placeholder="Enter caption..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-6 bg-base-50 flex gap-3">
                    <button onClick={onClose} className="btn btn-ghost flex-1">CANCEL</button>
                    <button
                        onClick={handleUpload}
                        className="btn btn-accent flex-1 text-white"
                        disabled={!file || loading}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'UPLOAD'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadModal;