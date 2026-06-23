import { beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Reports from './Reports';
vi.mock('../api', () => ({ api: vi.fn(), downloadApi: vi.fn() }));
import { api, downloadApi } from '../api';
const report = {
  from: '2026-06-01',
  to: '2026-06-21',
  generatedAt: '2026-06-21T10:00:00',
  summary: {
    activeHorses: 8,
    medicalEvents: 4,
    upcomingCare: 2,
    overdueCare: 1,
    reservations: 6,
    cancelledReservations: 1,
    participants: 10,
    totalCapacity: 15,
    lowStockItems: 2,
    feedingCoveragePercent: 87.5,
  },
  health: [
    {
      horseId: 1,
      horse: 'Luna',
      code: 'H-01',
      lastRecord: '2026-06-20',
      recordsInPeriod: 2,
      upcoming: 1,
      overdue: 0,
      nextDueDate: '2026-06-28',
      risk: 'PRÓXIMO',
    },
  ],
  inventory: [],
  activities: [],
  staff: [],
  feeding: [],
};
beforeEach(() => {
  vi.clearAllMocks();
  api.mockImplementation((url) => {
    const query = new URL(url, 'http://local').searchParams;
    return Promise.resolve({
      ...report,
      from: query.get('from') || report.from,
      to: query.get('to') || report.to,
    });
  });
});
it('muestra indicadores y permite abrir el reporte de salud', async () => {
  render(<Reports />);
  expect(await screen.findByText('Atenciones vencidas')).toBeTruthy();
  expect(screen.getByText('87.5%')).toBeTruthy();
  fireEvent.click(screen.getByRole('tab', { name: 'Salud' }));
  await waitFor(() => expect(screen.getByText('Luna')).toBeTruthy());
  expect(screen.getByText('PRÓXIMO')).toBeTruthy();
});
it('genera el PDF completo con el período seleccionado', async () => {
  downloadApi.mockResolvedValue();
  render(<Reports />);
  await screen.findByText('Atenciones vencidas');
  fireEvent.click(screen.getByRole('button', { name: 'PDF completo' }));
  await waitFor(() =>
    expect(downloadApi).toHaveBeenCalledWith(
      expect.stringContaining('/reports/overview.pdf?from='),
      expect.stringMatching(/reporte-operativo-.*\.pdf/)
    )
  );
});
it('aplica automáticamente el intervalo de fechas seleccionado', async () => {
  render(<Reports />);
  await screen.findByText('Atenciones vencidas');
  fireEvent.change(screen.getByLabelText('Desde'), {
    target: { value: '2026-04-01' },
  });
  fireEvent.change(screen.getByLabelText('Hasta'), {
    target: { value: '2026-05-15' },
  });
  await waitFor(() =>
    expect(api).toHaveBeenLastCalledWith(
      '/reports/overview?from=2026-04-01&to=2026-05-15&allHorses=false'
    )
  );
  expect(await screen.findByText('1/4/2026 — 15/5/2026')).toBeTruthy();
});
it('permite incluir todos los caballos en el reporte de salud', async () => {
  render(<Reports />);
  await screen.findByText('Atenciones vencidas');
  fireEvent.click(screen.getByRole('tab', { name: 'Salud' }));
  fireEvent.change(screen.getByLabelText('Mostrar'), {
    target: { value: 'all' },
  });
  await waitFor(() =>
    expect(api).toHaveBeenLastCalledWith(
      expect.stringContaining('allHorses=true')
    )
  );
});
it('envía el PDF al personal seleccionado', async () => {
  api.mockImplementation((url) => {
    if (url === '/reports/recipients')
      return Promise.resolve([
        {
          id: 7,
          name: 'Ana Vargas',
          email: 'ana@establo.test',
          role: 'CAREGIVER',
        },
      ]);
    if (url === '/reports/email') return Promise.resolve({ sent: 1 });
    const query = new URL(url, 'http://local').searchParams;
    return Promise.resolve({
      ...report,
      from: query.get('from') || report.from,
      to: query.get('to') || report.to,
    });
  });
  render(<Reports />);
  await screen.findByText('Atenciones vencidas');
  fireEvent.click(screen.getByRole('button', { name: 'Enviar por correo' }));
  fireEvent.click(await screen.findByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Enviar reporte' }));
  await waitFor(() =>
    expect(api).toHaveBeenCalledWith(
      '/reports/email',
      expect.objectContaining({ method: 'POST' })
    )
  );
  const request = api.mock.calls.find(([url]) => url === '/reports/email')[1];
  expect(JSON.parse(request.body)).toEqual(
    expect.objectContaining({ recipientIds: [7], allHorses: false })
  );
  expect(
    await screen.findByText('1 correo enviado correctamente')
  ).toBeTruthy();
});
