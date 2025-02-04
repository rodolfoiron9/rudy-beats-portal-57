import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ImageUploadPanelProps {
  faceImages: Record<string, string>;
  onImageUpload: (face: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadPanel = ({ faceImages, onImageUpload }: ImageUploadPanelProps) => {
  return (
    <div className="glass-card p-6 mb-8 w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Customize Cube Faces</h3>
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