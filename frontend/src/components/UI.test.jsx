import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { DataTable, PageHeader } from './UI';

afterEach(cleanup);

describe('DataTable', () => {
  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'breed', label: 'Raza' },
    {
      key: 'role',
      label: 'Rol',
      render: (value) => (value === 'CAREGIVER' ? 'Cuidador' : 'Veterinario'),
    },
  ];
  const rows = [
    { id: 1, name: 'Luna', breed: 'Criollo', role: 'CAREGIVER' },
    { id: 2, name: 'Trueno', breed: 'Andaluz', role: 'VETERINARIAN' },
  ];
  it('muestra registros y filtra por texto', () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByText('Luna')).toBeTruthy();
    expect(screen.getByText('Trueno')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Buscar registros'), {
      target: { value: 'andaluz' },
    });
    expect(screen.queryByText('Luna')).toBeNull();
    expect(screen.getByText('Trueno')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Buscar registros'), {
      target: { value: 'cuidador' },
    });
    expect(screen.getByText('Luna')).toBeTruthy();
    expect(screen.queryByText('Trueno')).toBeNull();
  });
});

describe('PageHeader', () => {
  it('ejecuta la acción principal', () => {
    let called = false;
    render(
      <PageHeader
        title="Caballos"
        subtitle="Listado"
        onAdd={() => {
          called = true;
        }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Nuevo registro' }));
    expect(called).toBe(true);
  });
});
