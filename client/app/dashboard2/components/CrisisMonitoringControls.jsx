import { Button } from "../ui/button";
import { Play, Square, AlertTriangle, CheckCircle } from "lucide-react";

export default function CrisisMonitoringControls({ 
  isMonitoring, 
  onStart, 
  onStop, 
  loading, 
  error 
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          🚨 Crisis Monitoring
        </h3>
        <div className="flex items-center gap-2">
          {isMonitoring ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Square className="w-4 h-4" />
              <span className="text-sm font-medium">Inactive</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-3">
        {!isMonitoring ? (
          <Button
            onClick={onStart}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {loading ? 'Starting...' : 'Start Monitoring'}
          </Button>
        ) : (
          <Button
            onClick={onStop}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            {loading ? 'Stopping...' : 'Stop Monitoring'}
          </Button>
        )}
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-600">
        {isMonitoring 
          ? "Monitoring active - updates every 5 seconds"
          : "Click start to begin real-time crisis monitoring"
        }
      </div>
    </div>
  );
}
