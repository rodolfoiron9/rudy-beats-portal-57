
import { Speaker } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

interface AudioSettingsProps {
  audioReactionEnabled: boolean;
  bassIntensity: number;
  onSettingChange: (key: string, value: number | boolean) => void;
}

export const AudioSettings = ({
  audioReactionEnabled,
  bassIntensity,
  onSettingChange,
}: AudioSettingsProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Audio Reaction</SidebarGroupLabel>
      <SidebarGroupContent className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Speaker className="h-4 w-4" />
            <span>Enable Audio Reaction</span>
          </div>
          <Switch
            checked={audioReactionEnabled}
            onCheckedChange={(checked) =>
              onSettingChange("audioReactionEnabled", checked)
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Bass Intensity</label>
          <Slider
            value={[bassIntensity]}
            onValueChange={([value]) =>
              onSettingChange("bassIntensity", value)
            }
            max={100}
            step={1}
          />
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
