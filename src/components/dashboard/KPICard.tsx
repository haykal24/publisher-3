import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: number;
  subtitle?: string;
  variant?: 'default' | 'success' | 'warning' | 'accent';
  icon?: React.ReactNode;
}

export function KPICard({ title, value, subtitle, variant = 'default', icon }: KPICardProps) {
  const variants = {
    default: "bg-gradient-primary text-primary-foreground",
    success: "bg-gradient-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    accent: "bg-gradient-accent text-accent-foreground"
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardContent className={cn("p-6", variants[variant])}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">{title}</p>
            <p className="text-3xl font-bold mb-1">{value.toLocaleString()}</p>
            {subtitle && (
              <p className="text-xs opacity-75">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className="opacity-80">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}