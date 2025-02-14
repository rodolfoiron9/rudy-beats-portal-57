
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioSettings } from "./settings/AudioSettings";
import { VisualSettings } from "./settings/VisualSettings";
import { AppearanceSettings } from "./settings/AppearanceSettings";

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
    onSettingsChange({ [key]: value });
  };

  const handleReset = () => {
    const defaultSettings = {
      bassIntensity: 50,
      audioReactionEnabled: true,
      zoomLevel: 5,
      pulseEnabled: false,
      pulseIntensity: 50,
      bounceEnabled: false,
      bounceIntensity: 50,
      edgesVisible: true,
      edgeColor: "#ffffff",
    };
    setSettings(defaultSettings);
    onSettingsChange(defaultSettings);
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
        <AudioSettings
          audioReactionEnabled={settings.audioReactionEnabled}
          bassIntensity={settings.bassIntensity}
          onSettingChange={handleSettingChange}
        />
        <VisualSettings
          zoomLevel={settings.zoomLevel}
          pulseEnabled={settings.pulseEnabled}
          pulseIntensity={settings.pulseIntensity}
          bounceEnabled={settings.bounceEnabled}
          bounceIntensity={settings.bounceIntensity}
          onSettingChange={handleSettingChange}
        />
        <AppearanceSettings
          edgesVisible={settings.edgesVisible}
          edgeColor={settings.edgeColor}
          onSettingChange={handleSettingChange}
        />
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleReset}
          >
            Reset to Defaults
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
