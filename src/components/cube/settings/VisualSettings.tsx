
import { ZoomIn, HeartPulse, ArrowUpDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

interface VisualSettingsProps {
  zoomLevel: number;
  pulseEnabled: boolean;
  pulseIntensity: number;
  bounceEnabled: boolean;
  bounceIntensity: number;
  onSettingChange: (key: string, value: number | boolean) => void;
}

export const VisualSettings = ({
  zoomLevel,
  pulseEnabled,
  pulseIntensity,
  bounceEnabled,
  bounceIntensity,
  onSettingChange,
}: VisualSettingsProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Visual Effects</SidebarGroupLabel>
      <SidebarGroupContent className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ZoomIn className="h-4 w-4" />
            <label className="text-sm">Zoom Level</label>
          </div>
          <Slider
            value={[zoomLevel]}
            onValueChange={([value]) =>
              onSettingChange("zoomLevel", value)
            }
            max={10}
            step={0.1}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4" />
            <span>Pulse Effect</span>
          </div>
          <Switch
            checked={pulseEnabled}
            onCheckedChange={(checked) =>
              onSettingChange("pulseEnabled", checked)
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Pulse Intensity</label>
          <Slider
            value={[pulseIntensity]}
            onValueChange={([value]) =>
              onSettingChange("pulseIntensity", value)
            }
            max={100}
            step={1}
            disabled={!pulseEnabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span>Bounce Effect</span>
          </div>
          <Switch
            checked={bounceEnabled}
            onCheckedChange={(checked) =>
              onSettingChange("bounceEnabled", checked)
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Bounce Intensity</label>
          <Slider
            value={[bounceIntensity]}
            onValueChange={([value]) =>
              onSettingChange("bounceIntensity", value)
            }
            max={100}
            step={1}
            disabled={!bounceEnabled}
          />
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
