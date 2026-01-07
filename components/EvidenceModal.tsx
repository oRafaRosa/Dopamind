import React, { useState } from 'react';
import { Camera, X, Upload, Check } from 'lucide-react';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

const EvidenceModal: React.FC<EvidenceModalProps> = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreviewUrl(url);
      setStep('preview');
    }
  };

  const handleConfirm = () => {
    setStep('success');
    setTimeout(() => {
      onConfirm();
      // Reset state after closing
      setTimeout(() => {
        setStep('upload');
        setPreviewUrl(null);
      }, 500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-sm rounded-2xl border border-gray-800 overflow-hidden relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-display font-bold text-white mb-1">EVIDÊNCIA</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">{taskTitle}</p>

          {step === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-700 rounded-xl h-64 flex flex-col items-center justify-center bg-gray-900/50 hover:border-neon-purple/50 transition-colors relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Camera size={48} className="text-gray-600 mb-4" />
                <p className="text-gray-400 font-bold text-sm">Tirar foto ou upload</p>
                <p className="text-gray-600 text-xs mt-2">Prove que você fez.</p>
              </div>
            </div>
          )}

          {step === 'preview' && previewUrl && (
            <div className="space-y-4 animate-slide-up">
              <div className="rounded-xl h-64 w-full bg-cover bg-center border border-gray-700 relative overflow-hidden" style={{ backgroundImage: `url(${previewUrl})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <button 
                onClick={handleConfirm}
                className="w-full bg-neon-green text-black font-bold py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-400 transition-colors"
              >
                <Upload size={18} />
                <span>ENVIAR EVIDÊNCIA</span>
              </button>
            </div>
          )}

          {step === 'success' && (
             <div className="h-64 flex flex-col items-center justify-center animate-slide-up">
                <div className="w-20 h-20 bg-neon-green/20 rounded-full flex items-center justify-center mb-4">
                    <Check size={40} className="text-neon-green" />
                </div>
                <h3 className="text-2xl font-bold text-white">VALIDADO</h3>
                <p className="text-gray-500 text-sm mt-2">XP Liberado.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvidenceModal;