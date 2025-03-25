import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: File | null;
  onChange?: (file: File | null) => void;
  label?: string;
  description?: string;
  maxSize?: number; // in MB
  accept?: string;
  error?: string;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, value, onChange, label, description, maxSize = 5, accept, error, ...props }, ref) => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (value) {
        setSelectedFile(value);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) {
        setSelectedFile(null);
        onChange && onChange(null);
        return;
      }

      const file = files[0];
      
      // Check file size
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        alert(`File size exceeds ${maxSize}MB limit.`);
        e.target.value = '';
        return;
      }

      setSelectedFile(file);
      onChange && onChange(file);
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedFile(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      onChange && onChange(null);
    };

    return (
      <div className={cn("", className)}>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        
        <div
          onClick={handleClick}
          className={cn(
            "border border-dashed rounded-md p-4 transition-colors cursor-pointer text-center",
            error ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-primary-500 hover:bg-primary-50"
          )}
        >
          <input
            type="file"
            ref={(node) => {
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              inputRef.current = node;
            }}
            className="hidden"
            onChange={handleChange}
            accept={accept}
            {...props}
          />

          {selectedFile ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-700 truncate max-w-xs">{selectedFile.name}</span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-600 hover:text-red-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-6 w-6 text-gray-400" />
              <p className="text-sm text-gray-700">
                <span className="font-medium text-primary-600 hover:text-primary-500">Click to upload</span> or drag and drop
              </p>
              {description && <p className="text-xs text-gray-500">{description}</p>}
            </div>
          )}
        </div>
        
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export { FileUpload };
