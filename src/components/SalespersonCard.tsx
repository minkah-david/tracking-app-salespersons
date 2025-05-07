
import { Salesperson } from "@/data/sampleData";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Navigation,
  Activity,
  Target
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";

interface SalespersonCardProps {
  salesperson: Salesperson;
  isActive?: boolean;
  onClick?: () => void;
  onViewRoute?: () => void;
}

const SalespersonCard: React.FC<SalespersonCardProps> = ({
  salesperson,
  isActive = false,
  onClick,
  onViewRoute
}) => {
  const progressPercent = (salesperson.salesForToday / salesperson.targetForToday) * 100;
  
  // Status color
  const statusColor = 
    salesperson.status === 'active' ? 'bg-green-500' :
    salesperson.status === 'idle' ? 'bg-yellow-500' :
    'bg-red-500';

  return (
    <Card className={`${isActive ? 'border-sales-blue ring-1 ring-sales-blue' : ''} transition-all hover:shadow-md`}>
      <CardHeader className="pb-2 pt-4 flex flex-row items-center gap-3">
        <div className="relative">
          <img 
            src={salesperson.avatar} 
            alt={salesperson.name}
            className="rounded-full h-12 w-12 object-cover"
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusColor} rounded-full border-2 border-white`}></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-lg">{salesperson.name}</div>
            <Badge variant={isActive ? "default" : "outline"}>
              {salesperson.status}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">{salesperson.assignedArea}</div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              Last seen:
            </div>
            <div className="font-medium">
              {formatDistanceToNow(new Date(salesperson.lastActive), { addSuffix: true })}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Target className="h-3.5 w-3.5 mr-1 text-sales-blue" />
                <span>Sales Target:</span>
              </div>
              <span className="font-medium">${salesperson.targetForToday}</span>
            </div>
            
            <Progress value={progressPercent} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <span>Current Sales: ${salesperson.salesForToday}</span>
              <span className={progressPercent >= 100 ? "text-green-500 font-medium" : "text-muted-foreground"}>
                {progressPercent.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onClick}
        >
          <MapPin className="mr-1 h-4 w-4" />
          Locate
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onViewRoute}
        >
          <Navigation className="mr-1 h-4 w-4" />
          View Route
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SalespersonCard;
