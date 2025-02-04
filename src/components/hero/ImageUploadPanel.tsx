import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";

interface ImageUploadPanelProps {
  faceImages: Record<string, string>;
  onImageUpload: (face: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadPanel = ({ faceImages, onImageUpload }: ImageUploadPanelProps) => {
  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const faces = Object.keys(faceImages);
    
    files.slice(0, 6).forEach((file, index) => {
      if (faces[index]) {
        // Create a new File array containing just this file
        const fileList = new DataTransfer();
        fileList.items.add(file);
        
        // Create a proper synthetic event
        const syntheticEvent = {
          target: {
            files: fileList.files,
            value: '',
            name: faces[index],
          },
          currentTarget: {
            files: fileList.files,
            value: '',
            name: faces[index],
          },
          preventDefault: () => {},
          stopPropagation: () => {},
          nativeEvent: new Event('change'),
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          type: 'change',
        } as React.ChangeEvent<HTMLInputElement>;
        
        onImageUpload(faces[index], syntheticEvent);
      }
    });
  };

  return (
    <div className="glass-card p-6 mb-8 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Customize Cube Faces</h3>
        <div className="relative">
          <input
            id="bulk-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleBulkUpload}
            className="hidden"
          />
          <label htmlFor="bulk-upload">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload All Faces
            </Button>
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(faceImages).map(([face]) => (
          <div key={face} className="space-y-2">
            <Label htmlFor={`${face}-upload`} className="capitalize">{face} Face</Label>
            <Input
              id={`${face}-upload`}
              type="file"
              accept="image/*"
              onChange={(e) => onImageUpload(face, e)}
              className="text-sm cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};