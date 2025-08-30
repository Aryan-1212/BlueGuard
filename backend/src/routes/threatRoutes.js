import express from "express";
import ThreatMonitoringService from "../services/threatMonitoringService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Process threat predictions and send SMS alerts
 * POST /api/threats/process
 */
router.post("/process", async (req, res) => {
  try {
    const { predictions, inputData } = req.body;
    
    if (!predictions || !inputData) {
      return res.status(400).json({ 
        message: "Predictions and input data are required" 
      });
    }

    console.log('📊 Processing threat predictions from frontend...');
    
    // Process threats and send SMS alerts
    const results = await ThreatMonitoringService.processThreatPredictions(predictions, inputData);
    
    res.json({
      success: true,
      message: "Threat processing complete",
      results
    });

  } catch (error) {
    console.error('❌ Error processing threats:', error);
    res.status(500).json({ 
      message: "Failed to process threats",
      error: error.message 
    });
  }
});

/**
 * Get current threat status and alert history
 * GET /api/threats/status
 */
router.get("/status", async (req, res) => {
  try {
    const threatStatus = ThreatMonitoringService.getCurrentThreatStatus();
    const alertHistory = ThreatMonitoringService.getAlertHistory();
    
    res.json({
      success: true,
      threatStatus,
      alertHistory,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error getting threat status:', error);
    res.status(500).json({ 
      message: "Failed to get threat status",
      error: error.message 
    });
  }
});

/**
 * Get alert history for a specific threat type
 * GET /api/threats/history/:threatType
 */
router.get("/history/:threatType", async (req, res) => {
  try {
    const { threatType } = req.params;
    const history = ThreatMonitoringService.getAlertHistory(threatType);
    
    res.json({
      success: true,
      threatType,
      history,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error getting threat history:', error);
    res.status(500).json({ 
      message: "Failed to get threat history",
      error: error.message 
    });
  }
});

/**
 * Update threat configuration (admin only)
 * PUT /api/threats/config/:threatType
 */
router.put("/config/:threatType", authMiddleware, async (req, res) => {
  try {
    const { threatType } = req.params;
    const { threshold, severity, recommendation } = req.body;
    
    const config = {};
    if (threshold !== undefined) config.threshold = threshold;
    if (severity) config.severity = severity;
    if (recommendation) config.recommendation = recommendation;
    
    ThreatMonitoringService.updateThreatConfig(threatType, config);
    
    res.json({
      success: true,
      message: `Threat configuration updated for ${threatType}`,
      config: ThreatMonitoringService.threatConfigs[threatType]
    });

  } catch (error) {
    console.error('❌ Error updating threat config:', error);
    res.status(500).json({ 
      message: "Failed to update threat configuration",
      error: error.message 
    });
  }
});

/**
 * Send test threat alert (for testing purposes)
 * POST /api/threats/test-alert
 */
router.post("/test-alert", authMiddleware, async (req, res) => {
  try {
    const { threatType, phoneNumber } = req.body;
    
    if (!threatType || !phoneNumber) {
      return res.status(400).json({ 
        message: "Threat type and phone number are required" 
      });
    }

    // Create test threat data
    const testThreatData = {
      status: 'THREAT',
      confidence: 0.85,
      level: 'High',
      inputData: {
        'LOCATION': 'Test Coastal Area',
        'CHLOROPHYLL MG_M3': 2.5,
        'CYCLONE_DISTANCE_KM': 150,
        'COASTAL EROSION_RISK': 75,
        'SEA_LEVEL_M': 1.2
      },
      config: ThreatMonitoringService.threatConfigs[threatType] || {
        name: threatType,
        severity: 'High',
        recommendation: 'Test recommendation'
      }
    };

    // Send personalized test alert
    const result = await ThreatMonitoringService.sendPersonalizedThreatAlert(
      req.user.id, 
      threatType, 
      testThreatData
    );
    
    if (result.success) {
      res.json({
        success: true,
        message: "Test threat alert sent successfully",
        result
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to send test alert",
        error: result.error
      });
    }

  } catch (error) {
    console.error('❌ Error sending test alert:', error);
    res.status(500).json({ 
      message: "Failed to send test alert",
      error: error.message 
    });
  }
});

/**
 * Clear alert history (for testing purposes)
 * DELETE /api/threats/clear-history
 */
router.delete("/clear-history", authMiddleware, async (req, res) => {
  try {
    ThreatMonitoringService.clearAlertHistory();
    
    res.json({
      success: true,
      message: "Alert history cleared successfully"
    });

  } catch (error) {
    console.error('❌ Error clearing alert history:', error);
    res.status(500).json({ 
      message: "Failed to clear alert history",
      error: error.message 
    });
  }
});

/**
 * Get threat configuration
 * GET /api/threats/config
 */
router.get("/config", async (req, res) => {
  try {
    res.json({
      success: true,
      configs: ThreatMonitoringService.threatConfigs,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error getting threat config:', error);
    res.status(500).json({ 
      message: "Failed to get threat configuration",
      error: error.message 
    });
  }
});

export default router;
