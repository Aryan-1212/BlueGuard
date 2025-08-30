import { AlertTriangle, CheckCircle, Info } from "lucide-react";

export default function CrisisStatusDisplay({ crisisData, lastUpdate }) {
  if (!crisisData) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2 text-gray-500">
          <Info className="w-4 h-4" />
          <span>No crisis data available</span>
        </div>
      </div>
    );
  }

  const { summary, predictions, threat_levels, probabilities, input_data } = crisisData;

  const getThreatColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getThreatIcon = (level) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'HIGH': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'MEDIUM': return <Info className="w-4 h-4 text-yellow-600" />;
      case 'LOW': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Threat Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">⚠️ Threat Summary</h3>
        
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{summary.critical_threats || 0}</div>
              <div className="text-sm text-red-700">Critical</div>
            </div>
            <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{summary.high_threats || 0}</div>
              <div className="text-sm text-orange-700">High</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{summary.medium_threats || 0}</div>
              <div className="text-sm text-yellow-700">Medium</div>
            </div>
            <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{summary.low_threats || 0}</div>
              <div className="text-sm text-green-700">Low</div>
            </div>
          </div>
        )}
        
        <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-xl font-bold text-blue-600">
            Total Threats: {summary?.total_threats || 0}
          </div>
        </div>
      </div>

      {/* Current Predictions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">🔮 Current Predictions</h3>
        
        {predictions && Object.keys(predictions).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(predictions).map(([threat, isThreat]) => {
              const level = threat_levels?.[threat];
              const prob = probabilities?.[threat];
              
              return (
                <div 
                  key={threat}
                  className={`p-3 rounded-lg border ${
                    isThreat 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getThreatIcon(level)}
                      <span className="font-medium text-gray-800">
                        {threat.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        isThreat ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {isThreat ? '⚠️ THREAT' : '✅ SAFE'}
                      </div>
                      <div className="text-xs text-gray-600">
                        {level} Level • {prob?.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            No predictions available
          </div>
        )}
      </div>

      {/* Input Data */}
      {input_data && (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 Input Data (Random Row)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(input_data).slice(0, 8).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">
                  {key.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-sm text-gray-600">
                  {typeof value === 'number' ? value.toFixed(3) : value}
                </span>
              </div>
            ))}
          </div>
          
          {Object.keys(input_data).length > 8 && (
            <div className="text-center text-xs text-gray-500 mt-2">
              +{Object.keys(input_data).length - 8} more fields
            </div>
          )}
        </div>
      )}

      {/* Last Update */}
      {lastUpdate && (
        <div className="text-center text-xs text-gray-500">
          Last updated: {lastUpdate.toLocaleString()}
        </div>
      )}
    </div>
  );
}
