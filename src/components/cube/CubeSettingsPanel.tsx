
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  ZoomIn,
  ZoomOut,
  Speaker,
  Square,
  HeartPulse,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CubeSettingsPanelProps {
  onSettingsChange: (settings: {
    bassIntensity?: number;
    audioReactionEnabled?: boolean;
    zoomLevel?: number;
    pulseEnabled?: boolean;
    pulseIntensity?: number;
    bounceEnabled?: boolean;
    bounceIntensity?: number;
    edgesVisible?: boolean;
    edgeColor?: string;
  }) => void;
}

export const CubeSettingsPanel = ({ onSettingsChange }: CubeSettingsPanelProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [settings, setSettings] = useState({
    bassIntensity: 50,
    audioReactionEnabled: true,
    zoomLevel: 5,
    pulseEnabled: false,
    pulseIntensity: 50,
    bounceEnabled: false,
    bounceIntensity: 50,
    edgesVisible: true,
    edgeColor: "#ffffff",
  });

  const handleSettingChange = (key: string, value: number | boolean | string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <Sidebar className="w-80 border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Cube Settings</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Audio Reaction</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Speaker className="h-4 w-4" />
                <span>Enable Audio Reaction</span>
              </div>
              <Switch
                checked={settings.audioReactionEnabled}
                onCheckedChange={(checked) =>
                  handleSettingChange("audioReactionEnabled", checked)
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Bass Intensity</label>
              <Slider
                value={[settings.bassIntensity]}
                onValueChange={([value]) =>
                  handleSettingChange("bassIntensity", value)
                }
                max={100}
                step={1}
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Visual Effects</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4 p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4" />
                <label className="text-sm">Zoom Level</label>
              </div>
              <Slider
                value={[settings.zoomLevel]}
                onValueChange={([value]) =>
                  handleSettingChange("zoomLevel", value)
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
                checked={settings.pulseEnabled}
                onCheckedChange={(checked) =>
                  handleSettingChange("pulseEnabled", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Pulse Intensity</label>
              <Slider
                value={[settings.pulseIntensity]}
                onValueChange={([value]) =>
                  handleSettingChange("pulseIntensity", value)
                }
                max={100}
                step={1}
                disabled={!settings.pulseEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span>Bounce Effect</span>
              </div>
              <Switch
                checked={settings.bounceEnabled}
                onCheckedChange={(checked) =>
                  handleSettingChange("bounceEnabled", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Bounce Intensity</label>
              <Slider
                value={[settings.bounceIntensity]}
                onValueChange={([value]) =>
                  handleSettingChange("bounceIntensity", value)
                }
                max={100}
                step={1}
                disabled={!settings.bounceEnabled}
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Cube Appearance</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                <span>Show Edges</span>
              </div>
              <Switch
                checked={settings.edgesVisible}
                onCheckedChange={(checked) =>
                  handleSettingChange("edgesVisible", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Edge Color</label>
              <input
                type="color"
                value={settings.edgeColor}
                onChange={(e) => handleSettingChange("edgeColor", e.target.value)}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent className="p-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSettings({
                  bassIntensity: 50,
                  audioReactionEnabled: true,
                  zoomLevel: 5,
                  pulseEnabled: false,
                  pulseIntensity: 50,
                  bounceEnabled: false,
                  bounceIntensity: 50,
                  edgesVisible: true,
                  edgeColor: "#ffffff",
                });
              }}
            >
              Reset to Defaults
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
