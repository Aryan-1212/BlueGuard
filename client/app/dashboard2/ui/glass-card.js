import { Card, CardContent } from "./card";
import { cn } from "../lib/utils";

export function GlassCard({ children, className, hover = true }) {
  return (
    <Card 
      className={cn(
        "kpi-card glass-effect border-white/20 backdrop-blur-md",
        hover && "hover:shadow-xl hover:-translate-y-1",
        "transition-all duration-300",
        className
      )}
      data-testid="glass-card"
    >
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}