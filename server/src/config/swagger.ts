export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'BarberCyber Pro API',
    version: '1.0.0',
    description: 'API de gestão para barbearias — agendamentos, equipe, finanças e relatórios.',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Desenvolvimento' },
    { url: process.env.API_URL || 'https://api.barbercyber.com', description: 'Produção' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { error: { type: 'string' } },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          planType: { type: 'string', enum: ['ESSENTIAL', 'ENTERPRISE'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string' },
        },
      },
      Staff: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          specialty: { type: 'string' },
          commissionRate: { type: 'number', example: 0.4 },
          isAvailable: { type: 'boolean' },
          userId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Appointment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          clientName: { type: 'string' },
          clientPhone: { type: 'string' },
          serviceName: { type: 'string' },
          price: { type: 'number' },
          scheduledAt: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'CANCELED', 'NO_SHOW'] },
          staffId: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
        },
      },
      FinanceSummary: {
        type: 'object',
        properties: {
          period: {
            type: 'object',
            properties: {
              startDate: { type: 'string' },
              endDate: { type: 'string' },
            },
          },
          totalAppointments: { type: 'integer' },
          totalGross: { type: 'number' },
          totalCommission: { type: 'number' },
          totalNetProfit: { type: 'number' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar novo usuário',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'João Silva' },
                  email: { type: 'string', format: 'email', example: 'joao@barbearia.com' },
                  password: { type: 'string', minLength: 6, example: 'senha123' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Usuário criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          '400': { description: 'Campos obrigatórios ausentes ou senha curta', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '409': { description: 'E-mail já cadastrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login de usuário',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login bem-sucedido', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          '400': { description: 'Campos obrigatórios ausentes', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '401': { description: 'Credenciais inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/staff': {
      get: {
        tags: ['Staff'],
        summary: 'Listar todos os barbeiros do dono',
        responses: {
          '200': { description: 'Lista de barbeiros', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Staff' } } } } },
          '401': { description: 'Token ausente ou inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      post: {
        tags: ['Staff'],
        summary: 'Criar barbeiro (respeita limite de plano)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'specialty', 'isAvailable'],
                properties: {
                  name: { type: 'string', example: 'Carlos Souza' },
                  specialty: { type: 'string', example: 'Degradê' },
                  commissionRate: { type: 'number', example: 0.4 },
                  isAvailable: { type: 'boolean', example: true },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Barbeiro criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Staff' } } } },
          '400': { description: 'Campos obrigatórios ausentes', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '401': { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '403': { description: 'Limite de barbeiros do plano atingido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/staff/{id}': {
      get: {
        tags: ['Staff'],
        summary: 'Buscar barbeiro por ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': { description: 'Barbeiro encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Staff' } } } },
          '401': { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '404': { description: 'Barbeiro não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        tags: ['Staff'],
        summary: 'Atualizar barbeiro',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  specialty: { type: 'string' },
                  commissionRate: { type: 'number' },
                  isAvailable: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Barbeiro atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Staff' } } } },
          '401': { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '404': { description: 'Barbeiro não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      delete: {
        tags: ['Staff'],
        summary: 'Deletar barbeiro',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '204': { description: 'Barbeiro deletado' },
          '401': { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '404': { description: 'Barbeiro não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/appointments': {
      get: {
        tags: ['Appointments'],
        summary: 'Listar agendamentos (filtros opcionais: date, staffId)',
        parameters: [
          { name: 'date', in: 'query', schema: { type: 'string', format: 'date' }, example: '2025-01-15' },
          { name: 'staffId', in: 'query', schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': { description: 'Lista de agendamentos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } } } } },
          '401': { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      post: {
        tags: ['Appointments'],
        summary: 'Criar agendamento',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['clientName', 'clientPhone', 'serviceName', 'price', 'scheduledAt', 'staffId'],
                properties: {
                  clientName: { type: 'string', example: 'Pedro Alves' },
                  clientPhone: { type: 'string', example: '11999999999' },
                  serviceName: { type: 'string', example: 'Corte + Barba' },
                  price: { type: 'number', example: 75 },
                  scheduledAt: { type: 'string', format: 'date-time' },
                  staffId: { type: 'string', format: 'uuid' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Agendamento criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } } },
          '400': { description: 'Campos obrigatórios ausentes', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '401': { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '404': { description: 'Barbeiro não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/appointments/{id}/status': {
      patch: {
        tags: ['Appointments'],
        summary: 'Atualizar status (COMPLETED gera Transaction automaticamente)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'CANCELED', 'NO_SHOW'] },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Status atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } } },
          '400': { description: 'Status inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '401': { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '404': { description: 'Agendamento não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/finance/summary': {
      get: {
        tags: ['Finance'],
        summary: 'Resumo financeiro por período',
        parameters: [
          { name: 'startDate', in: 'query', required: true, schema: { type: 'string', format: 'date' }, example: '2025-01-01' },
          { name: 'endDate', in: 'query', required: true, schema: { type: 'string', format: 'date' }, example: '2025-01-31' },
        ],
        responses: {
          '200': { description: 'Resumo financeiro', content: { 'application/json': { schema: { $ref: '#/components/schemas/FinanceSummary' } } } },
          '400': { description: 'Datas ausentes ou inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '401': { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/api/reports/daily': {
      get: {
        tags: ['Reports'],
        summary: 'Relatório diário (ESSENTIAL: máx 3/mês)',
        parameters: [
          { name: 'date', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Data do relatório (default: hoje)' },
        ],
        responses: {
          '200': { description: 'Relatório diário em JSON pronto para PDF' },
          '401': { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '403': { description: 'Limite mensal de relatórios atingido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
  },
};
