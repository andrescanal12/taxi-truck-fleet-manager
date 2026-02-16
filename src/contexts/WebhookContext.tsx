import React, { createContext, useContext, useState } from "react";

interface WebhookConfig {
  albaranWebhook: string;
  facturaWebhook: string;
  extractorWebhook: string;
}

interface WebhookContextType {
  config: WebhookConfig;
  updateConfig: (key: keyof WebhookConfig, value: string) => void;
}

const defaultConfig: WebhookConfig = {
  albaranWebhook: "",
  facturaWebhook: "",
  extractorWebhook: "",
};

const WebhookContext = createContext<WebhookContextType | undefined>(undefined);

export const WebhookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<WebhookConfig>(() => {
    const saved = localStorage.getItem("webhook-config");
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  const updateConfig = (key: keyof WebhookConfig, value: string) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("webhook-config", JSON.stringify(next));
      return next;
    });
  };

  return (
    <WebhookContext.Provider value={{ config, updateConfig }}>
      {children}
    </WebhookContext.Provider>
  );
};

export const useWebhooks = () => {
  const context = useContext(WebhookContext);
  if (!context) throw new Error("useWebhooks must be used within WebhookProvider");
  return context;
};
