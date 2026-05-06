export interface NotificationOption {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
  }
  
  export const mockNotificationSettings: NotificationOption[] = [
    {
      id: "goals",
      title: "Novas Metas Definidas",
      description: "Receba notificações quando novas metas forem estabelecidas",
      enabled: true,
    },
    {
      id: "performance",
      title: "Alertas de Desempenho",
      description: "Seja notificado sobre seu desempenho e métricas importantes",
      enabled: true,
    },
    {
      id: "reports",
      title: "Relatórios Disponíveis",
      description: "Receba um aviso quando os relatórios mensais estiverem prontos",
      enabled: false,
    },
  ];