import { useState, useRef } from 'react';
import { Camera, Upload, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { ExtractedItem, TransactionItem } from '@/types';
import { cn } from '@/lib/utils';

interface ScanUploadProps {
  onComplete: (items: TransactionItem[], type: 'purchase' | 'sale') => void;
}

type ScanStep = 'upload' | 'processing' | 'review' | 'complete';

export function ScanUpload({ onComplete }: ScanUploadProps) {
  const [step, setStep] = useState<ScanStep>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [transactionType, setTransactionType] = useState<'purchase' | 'sale'>('sale');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        simulateOCR();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateOCR = () => {
    setStep('processing');
    
    // Simulate OCR processing with demo data
    setTimeout(() => {
      const demoExtracted: ExtractedItem[] = [
        { name: 'Coffee Beans 500g', quantity: 10, price: 12.50, confidence: 0.95 },
        { name: 'Green Tea Box', quantity: 5, price: 8.00, confidence: 0.88 },
        { name: 'Chocolate Bar', quantity: 12, price: 4.50, confidence: 0.92 },
      ];
      setExtractedItems(demoExtracted);
      setStep('review');
    }, 2000);
  };

  const handleItemUpdate = (index: number, field: keyof ExtractedItem, value: string | number) => {
    setExtractedItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleRemoveItem = (index: number) => {
    setExtractedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    const transactionItems: TransactionItem[] = extractedItems.map((item, index) => ({
      id: `item-${index}`,
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.quantity * item.price,
    }));

    setStep('complete');
    setTimeout(() => {
      onComplete(transactionItems, transactionType);
      // Reset state
      setStep('upload');
      setImagePreview(null);
      setExtractedItems([]);
    }, 1500);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Scan Document</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload handwritten notes to digitize
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between px-4 animate-slide-up">
        {['Upload', 'Process', 'Review', 'Done'].map((label, index) => {
          const stepIndex = ['upload', 'processing', 'review', 'complete'].indexOf(step);
          const isActive = index === stepIndex;
          const isComplete = index < stepIndex;

          return (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                    isComplete && 'gradient-primary text-primary-foreground',
                    isActive && 'bg-primary/20 text-primary border-2 border-primary',
                    !isComplete && !isActive && 'bg-secondary text-muted-foreground'
                  )}
                >
                  {isComplete ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className="text-xs mt-1 text-muted-foreground">{label}</span>
              </div>
              {index < 3 && (
                <div
                  className={cn(
                    'w-8 h-0.5 mx-1 transition-colors',
                    isComplete ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Step */}
      {step === 'upload' && (
        <div className="space-y-4 animate-scale-in">
          {/* Transaction Type Selection */}
          <div className="glass p-4 rounded-xl">
            <p className="text-sm text-muted-foreground mb-3">Transaction Type</p>
            <div className="flex gap-2">
              <Button
                variant={transactionType === 'sale' ? 'default' : 'secondary'}
                className="flex-1"
                onClick={() => setTransactionType('sale')}
              >
                Sale Record
              </Button>
              <Button
                variant={transactionType === 'purchase' ? 'default' : 'secondary'}
                className="flex-1"
                onClick={() => setTransactionType('purchase')}
              >
                Purchase Record
              </Button>
            </div>
          </div>

          {/* Upload Area */}
          <div
            className="glass border-2 border-dashed border-border/50 hover:border-primary/50 rounded-xl p-8 text-center cursor-pointer transition-all"
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-2xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-foreground font-medium mb-1">
              Tap to upload image
            </p>
            <p className="text-sm text-muted-foreground">
              Take a photo or select from gallery
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="glass" className="h-14" onClick={triggerFileInput}>
              <Camera className="w-5 h-5 mr-2" />
              Camera
            </Button>
            <Button variant="glass" className="h-14" onClick={triggerFileInput}>
              <FileText className="w-5 h-5 mr-2" />
              Gallery
            </Button>
          </div>
        </div>
      )}

      {/* Processing Step */}
      {step === 'processing' && (
        <div className="glass p-8 rounded-xl text-center animate-scale-in">
          {imagePreview && (
            <div className="w-32 h-32 mx-auto mb-6 rounded-xl overflow-hidden">
              <img
                src={imagePreview}
                alt="Uploaded document"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-foreground font-medium">Processing document...</p>
          <p className="text-sm text-muted-foreground mt-1">
            Extracting text and matching products
          </p>
        </div>
      )}

      {/* Review Step */}
      {step === 'review' && (
        <div className="space-y-4 animate-scale-in">
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-foreground font-medium">Extracted Items</p>
              <span className="text-xs text-primary bg-primary/20 px-2 py-1 rounded-full">
                {extractedItems.length} items found
              </span>
            </div>

            <div className="space-y-3">
              {extractedItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-secondary/50 p-3 rounded-lg space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemUpdate(index, 'name', e.target.value)}
                      className="bg-transparent text-foreground font-medium text-sm flex-1 outline-none"
                    />
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-muted-foreground hover:text-destructive ml-2"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Qty:</span>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemUpdate(index, 'quantity', parseInt(e.target.value))}
                        className="bg-background/50 w-16 px-2 py-1 rounded text-foreground outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemUpdate(index, 'price', parseFloat(e.target.value))}
                        className="bg-background/50 w-20 px-2 py-1 rounded text-foreground outline-none"
                      />
                    </div>
                    {item.confidence < 0.9 && (
                      <AlertCircle className="w-4 h-4 text-warning" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="glass p-4 rounded-xl flex items-center justify-between">
            <span className="text-foreground font-medium">Total</span>
            <span className="text-xl font-bold text-primary">
              ${extractedItems.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
            </span>
          </div>

          <Button className="w-full" size="lg" onClick={handleConfirm}>
            <Check className="w-5 h-5 mr-2" />
            Confirm & Save
          </Button>
        </div>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <div className="glass p-8 rounded-xl text-center animate-scale-in">
          <div className="w-16 h-16 mx-auto mb-4 gradient-success rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-success-foreground" />
          </div>
          <p className="text-foreground font-medium text-lg">Success!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Transaction has been recorded
          </p>
        </div>
      )}
    </div>
  );
}
