
import { Square } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

interface AppearanceSettingsProps {
  edgesVisible: boolean;
  edgeColor: string;
  onSettingChange: (key: string, value: boolean | string) => void;
}

export const AppearanceSettings = ({
  edgesVisible,
  edgeColor,
  onSettingChange,
}: AppearanceSettingsProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Cube Appearance</SidebarGroupLabel>
      <SidebarGroupContent className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Square className="h-4 w-4" />
            <span>Show Edges</span>
          </div>
          <Switch
            checked={edgesVisible}
            onCheckedChange={(checked) =>
              onSettingChange("edgesVisible", checked)
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Edge Color</label>
          <input
            type="color"
            value={edgeColor}
            onChange={(e) => onSettingChange("edgeColor", e.target.value)}
            className="w-full h-8 rounded cursor-pointer"
          />
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
