# BioFarma - Pharma Sales Manager

Sistema de gestão mobile para o setor farmacêutico, focado no controle de produtividade de representantes e auditoria gerencial de cobertura de mercado.

## Proposta do Projeto
O BioFarma soluciona a fragmentação de dados entre a equipe de campo e a gestão. A aplicação oferece interfaces distintas para dois níveis de acesso, garantindo que o representante tenha agilidade no registro de visitas e o gerente tenha dados precisos para tomada de decisão estratégica.

## Funcionalidades Principais

### Módulo do Representante (Operacional)
* **Gestão de Roteiro:** Listagem diária de visitas com status em tempo real (Pendente, Realizada, Reagendada).
* **Fluxo de Check-in:** Registro de visitas com seleção de produtos em foco e inserção de notas técnicas/observações.
* **Indicadores de Performance:** Acompanhamento de metas individuais e métrica de cobertura (médicos visitados vs. base total).

### Módulo do Gerente (Auditoria)
* **Painel de Médicos:** Visualização analítica da base de CRM, permitindo identificar lacunas de cobertura por território.
* **Histórico de Visitação:** Timeline detalhada de interações por médico, incluindo histórico de 90 dias e logs de visitas da equipe.
* **Dashboard de Equipe:** Monitoramento consolidado de metas e KPIs globais da força de vendas.


## Stack Técnica
* **Framework:** React Native / Expo
* **Estilização:** Tailwind CSS (NativeWind)
* **Visualização de Dados:** Recharts e Componentes SVG Customizados
* **Gerenciamento:** GitHub Projects

## Notas de Implementação
O projeto utiliza um sistema de roteamento que alterna a estrutura de navegação com base no perfil de acesso (Manager/Representative). A lógica de negócio diferencia permissões de escrita, onde apenas o perfil operacional pode realizar check-ins, enquanto o perfil gerencial retém acesso exclusivo aos relatórios de auditoria.