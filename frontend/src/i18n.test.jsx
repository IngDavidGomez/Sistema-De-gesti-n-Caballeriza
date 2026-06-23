import { describe, expect, it } from 'vitest';
import { translateText } from './i18n';

describe('internationalization', () => {
  it('translates static and dynamic content to English', () => {
    expect(translateText('Caballos', 'en')).toBe('Horses');
    expect(translateText('Buenos días, Administrador', 'en')).toBe(
      'Good morning, Administrator'
    );
    expect(translateText('Fotografía de Luna', 'en')).toBe('Photo of Luna');
    expect(translateText('PRÓXIMO', 'en')).toBe('UPCOMING');
    expect(translateText('Atenciones próximas', 'en')).toBe('Upcoming care');
    expect(
      translateText(
        'Luna: Tratamiento antiinflamatorio de miembro anterior · 2026-06-30',
        'en'
      )
    ).toBe('Luna: Anti-inflammatory treatment of the forelimb · 2026-06-30');
    expect(translateText('Crear en Caballos', 'en')).toBe('Create in Horses');
  });

  it('translates content to French and preserves Spanish', () => {
    expect(translateText('Auditoría del sistema', 'fr')).toBe(
      'Audit du système'
    );
    expect(translateText('Heno premium, Avena integral', 'fr')).toBe(
      'Foin premium, Avoine complète'
    );
    expect(
      translateText('Vacuna influenza tiene 6 dosis; mínimo: 8', 'fr')
    ).toBe('Vaccin contre la grippe a 6 doses ; minimum : 8');
    expect(translateText('Las contraseñas no coinciden', 'fr')).toBe(
      'Les mots de passe ne correspondent pas'
    );
    expect(translateText('Inventario', 'es')).toBe('Inventario');
  });
});
