import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Languages } from 'lucide-react';

const LOCALES = { es: 'es-CR', en: 'en-US', fr: 'fr-FR' };
const EN = {
  'Gestión ecuestre': 'Equestrian management',
  'MENÚ PRINCIPAL': 'MAIN MENU',
  Resumen: 'Dashboard',
  Caballos: 'Horses',
  'Historial médico': 'Medical history',
  Agenda: 'Schedule',
  Alimentación: 'Feeding',
  Inventario: 'Inventory',
  Suministros: 'Supplies',
  Reportes: 'Reports',
  Personal: 'Staff',
  'Auditoría del sistema': 'System audit',
  'Panel de administración': 'Administration panel',
  'Control integral de la caballeriza': 'Comprehensive stable management',
  'Cerrar sesión': 'Sign out',
  'Cerrar menú': 'Close menu',
  'Abrir menú': 'Open menu',
  'Activar modo oscuro': 'Enable dark mode',
  'Activar modo claro': 'Enable light mode',
  Notificaciones: 'Notifications',
  ALERTAS: 'ALERTS',
  'Marcar leídas': 'Mark as read',
  'No hay alertas activas.': 'No active alerts.',
  Idioma: 'Language',
  'Nuevo registro': 'New record',
  'No hay registros': 'No records',
  'Buscar registros': 'Search records',
  'Buscar registros...': 'Search records...',
  registro: 'record',
  registros: 'records',
  Acciones: 'Actions',
  Cancelar: 'Cancel',
  Guardar: 'Save',
  Editar: 'Edit',
  Eliminar: 'Delete',
  Activo: 'Active',
  Inactivo: 'Inactive',
  Estado: 'Status',
  Nombre: 'Name',
  Descripción: 'Description',
  Responsable: 'Responsible person',
  Fecha: 'Date',
  Tipo: 'Type',
  Cantidad: 'Quantity',
  Detalle: 'Details',
  'Seleccione...': 'Select...',
  Todas: 'All',
  Todos: 'All',
  Sí: 'Yes',
  No: 'No',
  'Buenos días': 'Good morning',
  'OPERACIÓN DIARIA': 'DAILY OPERATIONS',
  'Todo lo importante de su caballeriza, en un solo lugar.':
    'Everything important about your stable, in one place.',
  'Operación al día': 'Operations up to date',
  'Servicios funcionando correctamente': 'Services are running correctly',
  'Caballos registrados': 'Registered horses',
  'Personal activo': 'Active staff',
  'Reservas totales': 'Total bookings',
  'Stock bajo': 'Low stock',
  SEGUIMIENTO: 'MONITORING',
  'Alertas y notificaciones': 'Alerts and notifications',
  'Ver detalles': 'View details',
  Alerta: 'Alert',
  GESTIÓN: 'MANAGEMENT',
  'Accesos rápidos': 'Quick actions',
  'Registrar caballo': 'Register horse',
  'Ver caballos': 'View horses',
  'Agendar reserva': 'Schedule booking',
  'Añadir control médico': 'Add medical record',
  'Registrar suministro': 'Record supply',
  Caballos: 'Horses',
  'Perfiles, características y estado de los ejemplares':
    'Profiles, characteristics and status of the horses',
  'Registrar caballo': 'Register horse',
  'Buscar caballos': 'Search horses',
  'Buscar por nombre, raza o código...': 'Search by name, breed or code...',
  'Filtrar por sexo': 'Filter by sex',
  'Todos los ejemplares': 'All horses',
  ejemplar: 'horse',
  ejemplares: 'horses',
  Macho: 'Male',
  Hembra: 'Female',
  años: 'years',
  'Editar perfil': 'Edit profile',
  'No se encontraron caballos con esos filtros.':
    'No horses matched those filters.',
  'Editar caballo': 'Edit horse',
  'Identificador *': 'Identifier *',
  'Nombre *': 'Name *',
  'Fecha de nacimiento *': 'Date of birth *',
  'Raza *': 'Breed *',
  'Sexo *': 'Sex *',
  'Peso (kg) *': 'Weight (kg) *',
  'Fotografía opcional': 'Optional photo',
  'Seleccionar imagen': 'Select image',
  'JPG, PNG o WebP · máximo 5 MB': 'JPG, PNG or WebP · maximum 5 MB',
  '¿Eliminar este caballo?': 'Delete this horse?',
  'Historial médico': 'Medical history',
  'Información restringida al personal veterinario':
    'Information restricted to veterinary staff',
  'Su rol no tiene permiso para consultar expedientes médicos.':
    'Your role cannot access medical records.',
  'Vacunas, tratamientos, alergias y observaciones':
    'Vaccines, treatments, allergies and observations',
  'Nuevo registro': 'New record',
  Caballo: 'Horse',
  'Próximo control': 'Next follow-up',
  Observaciones: 'Notes',
  'Editar registro': 'Edit record',
  'Eliminar registro': 'Delete record',
  'Editar registro médico': 'Edit medical record',
  'Nuevo registro médico': 'New medical record',
  'Caballo *': 'Horse *',
  'Tipo *': 'Type *',
  'Fecha *': 'Date *',
  'Responsable *': 'Responsible person *',
  'Descripción *': 'Description *',
  '¿Eliminar este registro médico?': 'Delete this medical record?',
  VACUNA: 'VACCINE',
  TRATAMIENTO: 'TREATMENT',
  ALERGIA: 'ALLERGY',
  OBSERVACIÓN: 'OBSERVATION',
  'Agenda y reservas': 'Schedule and bookings',
  'Citas veterinarias, montas, paseos y entrenamientos':
    'Veterinary appointments, rides, walks and training',
  'Nueva reserva': 'New booking',
  'Tipo de actividad': 'Activity type',
  'Limpiar filtros': 'Clear filters',
  Lista: 'List',
  Calendario: 'Calendar',
  'Fecha y hora': 'Date and time',
  Actividad: 'Activity',
  Cupo: 'Capacity',
  Cancelada: 'Cancelled',
  Programada: 'Scheduled',
  'Editar reserva': 'Edit booking',
  'Cancelar reserva': 'Cancel booking',
  'Actividad *': 'Activity *',
  'Inicio *': 'Start *',
  'Final *': 'End *',
  'Cliente o responsable *': 'Client or responsible person *',
  'Capacidad *': 'Capacity *',
  'Participantes *': 'Participants *',
  'Guardar reserva': 'Save booking',
  '¿Cancelar esta reserva?': 'Cancel this booking?',
  Monta: 'Riding',
  Paseo: 'Trail ride',
  Entrenamiento: 'Training',
  'Cita veterinaria': 'Veterinary appointment',
  'Mes anterior': 'Previous month',
  'Mes siguiente': 'Next month',
  Lun: 'Mon',
  Mar: 'Tue',
  Mié: 'Wed',
  Jue: 'Thu',
  Vie: 'Fri',
  Sáb: 'Sat',
  Dom: 'Sun',
  'Planes y horarios de alimentación por caballo':
    'Feeding plans and schedules by horse',
  'Nuevo plan': 'New plan',
  Alimento: 'Feed',
  Horario: 'Schedule',
  Notas: 'Notes',
  'Editar plan': 'Edit plan',
  'Eliminar plan': 'Delete plan',
  'Plan de alimentación': 'Feeding plan',
  'Tipo de alimento *': 'Feed type *',
  'Cantidad *': 'Quantity *',
  'Unidad *': 'Unit *',
  'Hora *': 'Time *',
  '¿Eliminar este plan?': 'Delete this plan?',
  'Control de alimentos, medicinas y suministros':
    'Control of feed, medicines and supplies',
  'Nuevo insumo': 'New item',
  Insumo: 'Item',
  Categoría: 'Category',
  Disponible: 'Available',
  Mínimo: 'Minimum',
  'Editar insumo': 'Edit item',
  'Categoría *': 'Category *',
  'Stock mínimo *': 'Minimum stock *',
  Alimento: 'Feed',
  Medicina: 'Medicine',
  Limpieza: 'Cleaning',
  Equipo: 'Equipment',
  '¿Eliminar insumo?': 'Delete this item?',
  'Movimientos de suministros': 'Supply movements',
  'Entradas y salidas con fecha, cantidad y responsable':
    'Incoming and outgoing supplies with date, quantity and responsible person',
  'Registrar movimiento': 'Record movement',
  Entrada: 'Incoming',
  Salida: 'Outgoing',
  'Revertir movimiento': 'Reverse movement',
  'Insumo *': 'Item *',
  'Fecha y hora *': 'Date and time *',
  Registrar: 'Record',
  '¿Revertir este movimiento?': 'Reverse this movement?',
  'Reportes operativos': 'Operational reports',
  'Indicadores para decisiones clínicas, logísticas y administrativas':
    'Indicators for clinical, logistical and administrative decisions',
  Desde: 'From',
  Hasta: 'To',
  'Generando...': 'Generating...',
  Actualizar: 'Refresh',
  'Generando PDF...': 'Generating PDF...',
  'PDF completo': 'Full PDF',
  Imprimir: 'Print',
  Salud: 'Health',
  Reservas: 'Bookings',
  'Generando indicadores...': 'Generating indicators...',
  'Período:': 'Period:',
  'Generado:': 'Generated:',
  'No hay caballos activos': 'No active horses',
  'Último registro': 'Last record',
  'Eventos período': 'Period events',
  'Próximos 30 días': 'Next 30 days',
  Vencidos: 'Overdue',
  'Próximo vencimiento': 'Next due date',
  Entradas: 'Incoming',
  Salidas: 'Outgoing',
  'No hay reservas en el período': 'No bookings in this period',
  Canceladas: 'Cancelled',
  Participantes: 'Participants',
  Capacidad: 'Capacity',
  Ocupación: 'Occupancy',
  Empleado: 'Employee',
  Rol: 'Role',
  Turno: 'Shift',
  'Reservas asignadas': 'Assigned bookings',
  Tareas: 'Tasks',
  Planes: 'Plans',
  Alimentos: 'Feeds',
  Horarios: 'Schedules',
  Cobertura: 'Coverage',
  'Atenciones vencidas': 'Overdue care',
  'Cobertura alimentaria': 'Feeding coverage',
  'Eventos médicos': 'Medical events',
  'Empleados, turnos y asignación de tareas':
    'Employees, shifts and task assignments',
  'Nuevo empleado': 'New employee',
  Contacto: 'Contact',
  'Editar empleado': 'Edit employee',
  'Eliminar empleado': 'Delete employee',
  'Rol *': 'Role *',
  'Contacto *': 'Contact *',
  Cuidador: 'Caregiver',
  Veterinario: 'Veterinarian',
  Potrador: 'Farrier',
  Administrador: 'Administrator',
  Cliente: 'Client',
  '¿Eliminar empleado?': 'Delete employee?',
  'Trazabilidad de acciones, usuarios y controles de seguridad':
    'Traceability of actions, users and security controls',
  'Generar PDF': 'Generate PDF',
  'Eventos registrados': 'Recorded events',
  'Usuarios en la vista': 'Users in view',
  'Correctos / fallidos': 'Successful / failed',
  Usuario: 'User',
  'Correo o usuario': 'Email or user',
  Acción: 'Action',
  Limpiar: 'Clear',
  Aplicar: 'Apply',
  'Cargando auditoría...': 'Loading audit...',
  'No hay eventos para los filtros seleccionados':
    'No events match the selected filters',
  Módulo: 'Module',
  Resultado: 'Result',
  IP: 'IP',
  Correcto: 'Successful',
  Fallido: 'Failed',
  Crear: 'Create',
  Actualizar: 'Update',
  Modificar: 'Modify',
  'Cambiar estado': 'Change status',
  'Cambiar rol': 'Change role',
  'Marcar leído': 'Mark as read',
  'Generar reporte': 'Generate report',
  'Usuarios y roles': 'Users and roles',
  'Permisos de acceso y estado de las cuentas':
    'Access permissions and account status',
  Correo: 'Email',
  Desactivar: 'Deactivate',
  Activar: 'Activate',
  Bienvenido: 'Welcome',
  'Crear cuenta': 'Create account',
  'Ingrese sus credenciales para continuar':
    'Enter your credentials to continue',
  'Regístrese como cliente de la caballeriza': 'Register as a stable client',
  'PERFILES DE DEMOSTRACIÓN': 'DEMO PROFILES',
  'Nombre completo': 'Full name',
  'Correo electrónico': 'Email',
  Contraseña: 'Password',
  '¿Olvidó su contraseña?': 'Forgot your password?',
  'Iniciar sesión': 'Sign in',
  'Procesando...': 'Processing...',
  '¿No tiene cuenta? Registrarse': 'No account? Register',
  '¿Ya tiene cuenta? Iniciar sesión': 'Already have an account? Sign in',
  'Acceso protegido mediante JWT': 'Access protected with JWT',
  'GESTIÓN ECUESTRE': 'EQUESTRIAN MANAGEMENT',
  'Cuidado excepcional,': 'Exceptional care,',
  'gestión inteligente.': 'smart management.',
  'Todo lo que su caballeriza necesita en un solo lugar.':
    'Everything your stable needs in one place.',
  'Galería de caballos del establo': 'Stable horse gallery',
  'SEGURIDAD DE LA CUENTA': 'ACCOUNT SECURITY',
  'Recupere el acceso': 'Recover access',
  'de forma segura.': 'securely.',
  'Los enlaces son personales y vencen automáticamente.':
    'Links are personal and expire automatically.',
  'Nueva contraseña': 'New password',
  'Recuperar acceso': 'Recover access',
  'Cree una contraseña segura para su cuenta.':
    'Create a secure password for your account.',
  'Le enviaremos un enlace si el correo está registrado.':
    'We will send a link if the email is registered.',
  'Confirmar contraseña': 'Confirm password',
  'Actualizar contraseña': 'Update password',
  'Enviar instrucciones': 'Send instructions',
  'Volver al inicio de sesión': 'Back to sign in',
  'Enlace cifrado y válido por 30 minutos':
    'Encrypted link valid for 30 minutes',
};

const FR = {
  'Gestión ecuestre': 'Gestion équestre',
  'MENÚ PRINCIPAL': 'MENU PRINCIPAL',
  Resumen: 'Tableau de bord',
  Caballos: 'Chevaux',
  'Historial médico': 'Dossier médical',
  Agenda: 'Agenda',
  Alimentación: 'Alimentation',
  Inventario: 'Inventaire',
  Suministros: 'Fournitures',
  Reportes: 'Rapports',
  Personal: 'Personnel',
  'Auditoría del sistema': 'Audit du système',
  'Panel de administración': 'Panneau d’administration',
  'Control integral de la caballeriza': 'Gestion complète de l’écurie',
  'Cerrar sesión': 'Se déconnecter',
  'Cerrar menú': 'Fermer le menu',
  'Abrir menú': 'Ouvrir le menu',
  'Activar modo oscuro': 'Activer le mode sombre',
  'Activar modo claro': 'Activer le mode clair',
  Notificaciones: 'Notifications',
  ALERTAS: 'ALERTES',
  'Marcar leídas': 'Marquer comme lues',
  'No hay alertas activas.': 'Aucune alerte active.',
  Idioma: 'Langue',
  'Nuevo registro': 'Nouvel enregistrement',
  'No hay registros': 'Aucun enregistrement',
  'Buscar registros': 'Rechercher',
  'Buscar registros...': 'Rechercher...',
  registro: 'enregistrement',
  registros: 'enregistrements',
  Acciones: 'Actions',
  Cancelar: 'Annuler',
  Guardar: 'Enregistrer',
  Editar: 'Modifier',
  Eliminar: 'Supprimer',
  Activo: 'Actif',
  Inactivo: 'Inactif',
  Estado: 'Statut',
  Nombre: 'Nom',
  Descripción: 'Description',
  Responsable: 'Responsable',
  Fecha: 'Date',
  Tipo: 'Type',
  Cantidad: 'Quantité',
  Detalle: 'Détail',
  'Seleccione...': 'Sélectionner...',
  Todas: 'Toutes',
  Todos: 'Tous',
  Sí: 'Oui',
  No: 'Non',
  'Buenos días': 'Bonjour',
  'OPERACIÓN DIARIA': 'OPÉRATIONS QUOTIDIENNES',
  'Todo lo importante de su caballeriza, en un solo lugar.':
    'Tout ce qui compte pour votre écurie, en un seul endroit.',
  'Operación al día': 'Opérations à jour',
  'Servicios funcionando correctamente':
    'Les services fonctionnent correctement',
  'Caballos registrados': 'Chevaux enregistrés',
  'Personal activo': 'Personnel actif',
  'Reservas totales': 'Réservations totales',
  'Stock bajo': 'Stock faible',
  SEGUIMIENTO: 'SUIVI',
  'Alertas y notificaciones': 'Alertes et notifications',
  'Ver detalles': 'Voir les détails',
  Alerta: 'Alerte',
  GESTIÓN: 'GESTION',
  'Accesos rápidos': 'Accès rapides',
  'Registrar caballo': 'Enregistrer un cheval',
  'Ver caballos': 'Voir les chevaux',
  'Agendar reserva': 'Planifier une réservation',
  'Añadir control médico': 'Ajouter un suivi médical',
  'Registrar suministro': 'Enregistrer une fourniture',
  'Perfiles, características y estado de los ejemplares':
    'Profils, caractéristiques et état des chevaux',
  'Buscar caballos': 'Rechercher des chevaux',
  'Buscar por nombre, raza o código...': 'Rechercher par nom, race ou code...',
  'Filtrar por sexo': 'Filtrer par sexe',
  'Todos los ejemplares': 'Tous les chevaux',
  ejemplar: 'cheval',
  ejemplares: 'chevaux',
  Macho: 'Mâle',
  Hembra: 'Femelle',
  años: 'ans',
  'Editar perfil': 'Modifier le profil',
  'No se encontraron caballos con esos filtros.':
    'Aucun cheval ne correspond à ces filtres.',
  'Editar caballo': 'Modifier le cheval',
  'Identificador *': 'Identifiant *',
  'Nombre *': 'Nom *',
  'Fecha de nacimiento *': 'Date de naissance *',
  'Raza *': 'Race *',
  'Sexo *': 'Sexe *',
  'Peso (kg) *': 'Poids (kg) *',
  'Fotografía opcional': 'Photo facultative',
  'Seleccionar imagen': 'Sélectionner une image',
  'JPG, PNG o WebP · máximo 5 MB': 'JPG, PNG ou WebP · maximum 5 Mo',
  '¿Eliminar este caballo?': 'Supprimer ce cheval ?',
  'Información restringida al personal veterinario':
    'Informations réservées au personnel vétérinaire',
  'Su rol no tiene permiso para consultar expedientes médicos.':
    'Votre rôle ne permet pas de consulter les dossiers médicaux.',
  'Vacunas, tratamientos, alergias y observaciones':
    'Vaccins, traitements, allergies et observations',
  Caballo: 'Cheval',
  'Próximo control': 'Prochain contrôle',
  Observaciones: 'Observations',
  'Editar registro': 'Modifier le dossier',
  'Eliminar registro': 'Supprimer le dossier',
  'Editar registro médico': 'Modifier le dossier médical',
  'Nuevo registro médico': 'Nouveau dossier médical',
  'Caballo *': 'Cheval *',
  'Tipo *': 'Type *',
  'Fecha *': 'Date *',
  'Responsable *': 'Responsable *',
  'Descripción *': 'Description *',
  '¿Eliminar este registro médico?': 'Supprimer ce dossier médical ?',
  VACUNA: 'VACCIN',
  TRATAMIENTO: 'TRAITEMENT',
  ALERGIA: 'ALLERGIE',
  OBSERVACIÓN: 'OBSERVATION',
  'Agenda y reservas': 'Agenda et réservations',
  'Citas veterinarias, montas, paseos y entrenamientos':
    'Rendez-vous vétérinaires, montes, promenades et entraînements',
  'Nueva reserva': 'Nouvelle réservation',
  'Tipo de actividad': 'Type d’activité',
  'Limpiar filtros': 'Effacer les filtres',
  Lista: 'Liste',
  Calendario: 'Calendrier',
  'Fecha y hora': 'Date et heure',
  Actividad: 'Activité',
  Cupo: 'Capacité',
  Cancelada: 'Annulée',
  Programada: 'Planifiée',
  'Editar reserva': 'Modifier la réservation',
  'Cancelar reserva': 'Annuler la réservation',
  'Actividad *': 'Activité *',
  'Inicio *': 'Début *',
  'Final *': 'Fin *',
  'Cliente o responsable *': 'Client ou responsable *',
  'Capacidad *': 'Capacité *',
  'Participantes *': 'Participants *',
  'Guardar reserva': 'Enregistrer la réservation',
  '¿Cancelar esta reserva?': 'Annuler cette réservation ?',
  Monta: 'Monte',
  Paseo: 'Promenade',
  Entrenamiento: 'Entraînement',
  'Cita veterinaria': 'Rendez-vous vétérinaire',
  'Mes anterior': 'Mois précédent',
  'Mes siguiente': 'Mois suivant',
  Lun: 'Lun',
  Mar: 'Mar',
  Mié: 'Mer',
  Jue: 'Jeu',
  Vie: 'Ven',
  Sáb: 'Sam',
  Dom: 'Dim',
  'Planes y horarios de alimentación por caballo':
    'Plans et horaires d’alimentation par cheval',
  'Nuevo plan': 'Nouveau plan',
  Alimento: 'Aliment',
  Horario: 'Horaire',
  Notas: 'Notes',
  'Editar plan': 'Modifier le plan',
  'Eliminar plan': 'Supprimer le plan',
  'Plan de alimentación': 'Plan d’alimentation',
  'Tipo de alimento *': 'Type d’aliment *',
  'Cantidad *': 'Quantité *',
  'Unidad *': 'Unité *',
  'Hora *': 'Heure *',
  '¿Eliminar este plan?': 'Supprimer ce plan ?',
  'Control de alimentos, medicinas y suministros':
    'Contrôle des aliments, médicaments et fournitures',
  'Nuevo insumo': 'Nouvel article',
  Insumo: 'Article',
  Categoría: 'Catégorie',
  Disponible: 'Disponible',
  Mínimo: 'Minimum',
  'Editar insumo': 'Modifier l’article',
  'Categoría *': 'Catégorie *',
  'Stock mínimo *': 'Stock minimum *',
  Alimento: 'Aliment',
  Medicina: 'Médicament',
  Limpieza: 'Nettoyage',
  Equipo: 'Équipement',
  '¿Eliminar insumo?': 'Supprimer cet article ?',
  'Movimientos de suministros': 'Mouvements de fournitures',
  'Entradas y salidas con fecha, cantidad y responsable':
    'Entrées et sorties avec date, quantité et responsable',
  'Registrar movimiento': 'Enregistrer le mouvement',
  Entrada: 'Entrée',
  Salida: 'Sortie',
  'Revertir movimiento': 'Annuler le mouvement',
  'Insumo *': 'Article *',
  'Fecha y hora *': 'Date et heure *',
  Registrar: 'Enregistrer',
  '¿Revertir este movimiento?': 'Annuler ce mouvement ?',
  'Reportes operativos': 'Rapports opérationnels',
  'Indicadores para decisiones clínicas, logísticas y administrativas':
    'Indicateurs pour les décisions cliniques, logistiques et administratives',
  Desde: 'Du',
  Hasta: 'Au',
  'Generando...': 'Génération...',
  Actualizar: 'Actualiser',
  'Generando PDF...': 'Génération du PDF...',
  'PDF completo': 'PDF complet',
  Imprimir: 'Imprimer',
  Salud: 'Santé',
  Reservas: 'Réservations',
  'Generando indicadores...': 'Génération des indicateurs...',
  'Período:': 'Période :',
  'Generado:': 'Généré :',
  'No hay caballos activos': 'Aucun cheval actif',
  'Último registro': 'Dernier dossier',
  'Eventos período': 'Événements de la période',
  'Próximos 30 días': '30 prochains jours',
  Vencidos: 'En retard',
  'Próximo vencimiento': 'Prochaine échéance',
  Entradas: 'Entrées',
  Salidas: 'Sorties',
  'No hay reservas en el período': 'Aucune réservation sur la période',
  Canceladas: 'Annulées',
  Participantes: 'Participants',
  Capacidad: 'Capacité',
  Ocupación: 'Occupation',
  Empleado: 'Employé',
  Rol: 'Rôle',
  Turno: 'Quart',
  'Reservas asignadas': 'Réservations attribuées',
  Tareas: 'Tâches',
  Planes: 'Plans',
  Alimentos: 'Aliments',
  Horarios: 'Horaires',
  Cobertura: 'Couverture',
  'Atenciones vencidas': 'Soins en retard',
  'Cobertura alimentaria': 'Couverture alimentaire',
  'Eventos médicos': 'Événements médicaux',
  'Empleados, turnos y asignación de tareas':
    'Employés, quarts et attribution des tâches',
  'Nuevo empleado': 'Nouvel employé',
  Contacto: 'Contact',
  'Editar empleado': 'Modifier l’employé',
  'Eliminar empleado': 'Supprimer l’employé',
  'Rol *': 'Rôle *',
  'Contacto *': 'Contact *',
  Cuidador: 'Soigneur',
  Veterinario: 'Vétérinaire',
  Potrador: 'Maréchal-ferrant',
  Administrador: 'Administrateur',
  Cliente: 'Client',
  '¿Eliminar empleado?': 'Supprimer l’employé ?',
  'Trazabilidad de acciones, usuarios y controles de seguridad':
    'Traçabilité des actions, utilisateurs et contrôles de sécurité',
  'Generar PDF': 'Générer le PDF',
  'Eventos registrados': 'Événements enregistrés',
  'Usuarios en la vista': 'Utilisateurs affichés',
  'Correctos / fallidos': 'Réussis / échoués',
  Usuario: 'Utilisateur',
  'Correo o usuario': 'E-mail ou utilisateur',
  Acción: 'Action',
  Limpiar: 'Effacer',
  Aplicar: 'Appliquer',
  'Cargando auditoría...': 'Chargement de l’audit...',
  'No hay eventos para los filtros seleccionados':
    'Aucun événement pour les filtres sélectionnés',
  Módulo: 'Module',
  Resultado: 'Résultat',
  Correcto: 'Réussi',
  Fallido: 'Échoué',
  Crear: 'Créer',
  Actualizar: 'Actualiser',
  Modificar: 'Modifier',
  'Cambiar estado': 'Changer le statut',
  'Cambiar rol': 'Changer le rôle',
  'Marcar leído': 'Marquer comme lu',
  'Generar reporte': 'Générer le rapport',
  'Usuarios y roles': 'Utilisateurs et rôles',
  'Permisos de acceso y estado de las cuentas':
    'Autorisations d’accès et statut des comptes',
  Correo: 'E-mail',
  Desactivar: 'Désactiver',
  Activar: 'Activer',
  Bienvenido: 'Bienvenue',
  'Crear cuenta': 'Créer un compte',
  'Ingrese sus credenciales para continuar':
    'Saisissez vos identifiants pour continuer',
  'Regístrese como cliente de la caballeriza':
    'Inscrivez-vous comme client de l’écurie',
  'PERFILES DE DEMOSTRACIÓN': 'PROFILS DE DÉMONSTRATION',
  'Nombre completo': 'Nom complet',
  'Correo electrónico': 'E-mail',
  Contraseña: 'Mot de passe',
  '¿Olvidó su contraseña?': 'Mot de passe oublié ?',
  'Iniciar sesión': 'Se connecter',
  'Procesando...': 'Traitement...',
  '¿No tiene cuenta? Registrarse': 'Pas de compte ? S’inscrire',
  '¿Ya tiene cuenta? Iniciar sesión': 'Déjà un compte ? Se connecter',
  'Acceso protegido mediante JWT': 'Accès protégé par JWT',
  'GESTIÓN ECUESTRE': 'GESTION ÉQUESTRE',
  'Cuidado excepcional,': 'Des soins exceptionnels,',
  'gestión inteligente.': 'une gestion intelligente.',
  'Todo lo que su caballeriza necesita en un solo lugar.':
    'Tout ce dont votre écurie a besoin, en un seul endroit.',
  'Galería de caballos del establo': 'Galerie des chevaux de l’écurie',
  'SEGURIDAD DE LA CUENTA': 'SÉCURITÉ DU COMPTE',
  'Recupere el acceso': 'Récupérez l’accès',
  'de forma segura.': 'en toute sécurité.',
  'Los enlaces son personales y vencen automáticamente.':
    'Les liens sont personnels et expirent automatiquement.',
  'Nueva contraseña': 'Nouveau mot de passe',
  'Recuperar acceso': 'Récupérer l’accès',
  'Cree una contraseña segura para su cuenta.':
    'Créez un mot de passe sécurisé.',
  'Le enviaremos un enlace si el correo está registrado.':
    'Nous enverrons un lien si l’e-mail est enregistré.',
  'Confirmar contraseña': 'Confirmer le mot de passe',
  'Actualizar contraseña': 'Mettre à jour le mot de passe',
  'Enviar instrucciones': 'Envoyer les instructions',
  'Volver al inicio de sesión': 'Retour à la connexion',
  'Enlace cifrado y válido por 30 minutos': 'Lien chiffré valable 30 minutes',
};

const EN_EXTRA = {
  Mostrar: 'Show',
  'Con registros en el período': 'With records in the period',
  'Todos los caballos': 'All horses',
  'No hay registros médicos en el período':
    'No medical records in the selected period',
  Auditoría: 'Audit',
  Sistema: 'System',
  Consultar: 'View',
  CONSULTAR: 'VIEW',
  Código: 'Code',
  'Registros período': 'Period records',
  Próximos: 'Upcoming',
  Indicador: 'Indicator',
  Valor: 'Value',
  Stock: 'Stock',
  Unidad: 'Unit',
  'Caballos activos': 'Active horses',
  'Atenciones próximas': 'Upcoming care',
  'Reservas canceladas': 'Cancelled bookings',
  'Cupos disponibles': 'Available capacity',
  'Insumos con stock bajo': 'Low-stock items',
  'Reservas del período': 'Period bookings',
  Cancelaciones: 'Cancellations',
  'Próxima fecha': 'Next date',
  Eventos: 'Events',
  VENCIDO: 'OVERDUE',
  BAJO: 'LOW',
  DISPONIBLE: 'AVAILABLE',
  PRÓXIMO: 'UPCOMING',
  'SIN PLAN': 'NO PLAN',
  CUBIERTO: 'COVERED',
  'AL DÍA': 'UP TO DATE',
  INACTIVO: 'INACTIVE',
  SCHEDULED: 'Scheduled',
  CANCELLED: 'Cancelled',
  ADMIN: 'Administrator',
  CAREGIVER: 'Caregiver',
  VETERINARIAN: 'Veterinarian',
  CLIENT: 'Client',
  FARRIER: 'Farrier',
  ADMINISTRATOR: 'Administrator',
  PASEO: 'Trail ride',
  MONTA: 'Riding',
  ENTRENAMIENTO: 'Training',
  VETERINARIA: 'Veterinary appointment',
  'Vacunación próxima': 'Upcoming vaccination',
  'Seguimiento de tratamiento': 'Treatment follow-up',
  'Tratamiento vencido': 'Overdue treatment',
  'Control médico próximo': 'Upcoming medical check-up',
  'Las contraseñas no coinciden': 'Passwords do not match',
  'Credenciales incorrectas': 'Incorrect credentials',
  'Datos inválidos': 'Invalid data',
  Inválido: 'Invalid',
  'El correo ya está registrado': 'The email is already registered',
  'El identificador ya existe': 'The identifier already exists',
  'Debe seleccionar una imagen': 'You must select an image',
  'Formato no permitido. Use JPG, PNG o WebP':
    'Unsupported format. Use JPG, PNG or WebP',
  'La imagen no puede superar 5 MB': 'The image cannot exceed 5 MB',
  'No se pudo guardar la imagen': 'The image could not be saved',
  'No se pudo guardar la imagen en la nube':
    'The image could not be saved to cloud storage',
  'El enlace no es válido o ya venció': 'The link is invalid or has expired',
  'La fecha inicial no puede ser posterior a la final':
    'The start date cannot be later than the end date',
  'El período del reporte no puede superar un año':
    'The report period cannot exceed one year',
  'La hora final debe ser posterior a la inicial':
    'The end time must be later than the start time',
  'El cupo solicitado supera la capacidad disponible':
    'The requested number exceeds the available capacity',
  'El caballo ya tiene una reserva en ese horario':
    'The horse already has a booking at that time',
  'No hay existencias suficientes para registrar la salida':
    'There is not enough stock to record the outgoing movement',
  'No se puede revertir el movimiento porque produciría stock negativo':
    'The movement cannot be reversed because it would create negative stock',
  'Insumo no encontrado': 'Item not found',
  'Movimiento no encontrado': 'Movement not found',
  'Plan no encontrado': 'Plan not found',
  'Usuario no encontrado': 'User not found',
  'Debe existir al menos un administrador activo':
    'There must be at least one active administrator',
  'La operación incumple una regla de integridad de datos':
    'The operation violates a data integrity rule',
  'Si el correo está registrado, recibirá instrucciones para restablecer su contraseña':
    'If the email is registered, you will receive password reset instructions',
  'Alimentación, limpieza y revisión de establos':
    'Feeding, cleaning and stable inspection',
  'Consultas, vacunación y seguimiento clínico':
    'Consultations, vaccination and clinical follow-up',
  'Tratamientos y emergencias veterinarias':
    'Veterinary treatments and emergencies',
  'Herraje, cascos y mantenimiento preventivo':
    'Shoeing, hoof care and preventive maintenance',
  'Alimentación vespertina y supervisión': 'Evening feeding and supervision',
  'Heno premium': 'Premium hay',
  Desparasitante: 'Dewormer',
  'Avena integral': 'Whole oats',
  'Concentrado deportivo': 'Performance feed',
  'Suplemento vitamínico': 'Vitamin supplement',
  'Botiquín veterinario': 'Veterinary first-aid kit',
  'Champú equino': 'Horse shampoo',
  'Herraduras estándar': 'Standard horseshoes',
  'Vacuna influenza': 'Influenza vaccine',
  dosis: 'doses',
  frascos: 'bottles',
  kits: 'kits',
  litros: 'liters',
  unidades: 'units',
  'Pura Raza Española': 'Pure Spanish Horse',
  Andaluz: 'Andalusian',
  'Cuarto de Milla': 'Quarter Horse',
  Percherón: 'Percheron',
  Árabe: 'Arabian',
  'Refuerzo anual contra influenza': 'Annual influenza booster',
  'Sin reacciones adversas': 'No adverse reactions',
  'Tratamiento antiinflamatorio de miembro anterior':
    'Anti-inflammatory treatment of the forelimb',
  'Evolución favorable': 'Favorable progress',
  'Sensibilidad confirmada a penicilina': 'Confirmed penicillin sensitivity',
  'Usar antibiótico alternativo': 'Use an alternative antibiotic',
  'Vacunación contra tétanos': 'Tetanus vaccination',
  'Esquema actualizado': 'Schedule up to date',
  'Control odontológico semestral': 'Semiannual dental check-up',
  'Desgaste normal': 'Normal wear',
  'Limpieza y cuidado preventivo de cascos':
    'Preventive hoof cleaning and care',
  'Revisar herraje en próxima visita': 'Check shoeing at the next visit',
  'Refuerzo anual de vacuna contra influenza':
    'Annual influenza vaccine booster',
  'Aplicar durante la próxima visita': 'Administer during the next visit',
  'Cierre de tratamiento digestivo': 'Completion of digestive treatment',
  'Tratamiento vencido pendiente de revisión':
    'Overdue treatment pending review',
  'Dividir en dos porciones': 'Divide into two portions',
  'Complementar con agua fresca': 'Supplement with fresh water',
  'Ración de mantenimiento': 'Maintenance ration',
  'Previo al entrenamiento': 'Before training',
  'Agregar suplemento vitamínico': 'Add vitamin supplement',
  'Dieta baja en azúcares': 'Low-sugar diet',
  'Ración para caballo de tiro': 'Draft-horse ration',
  'Monitorear ganancia de peso': 'Monitor weight gain',
  'Recepción semanal de proveedor': 'Weekly supplier delivery',
  'Consumo diario de alimentación': 'Daily feed consumption',
  'Tratamiento preventivo': 'Preventive treatment',
  'Trabajo de doma avanzada': 'Advanced dressage work',
  'Paseo guiado de una hora': 'One-hour guided ride',
  'Control general programado': 'Scheduled general check-up',
  'Clase de nivel intermedio': 'Intermediate-level lesson',
  'Adaptación a pista exterior': 'Outdoor arena adaptation',
  'Paseo recreativo supervisado': 'Supervised recreational ride',
};

const FR_EXTRA = {
  Mostrar: 'Afficher',
  'Con registros en el período': 'Avec des dossiers sur la période',
  'Todos los caballos': 'Tous les chevaux',
  'No hay registros médicos en el período':
    'Aucun dossier médical sur la période sélectionnée',
  Auditoría: 'Audit',
  Sistema: 'Système',
  Consultar: 'Consulter',
  CONSULTAR: 'CONSULTER',
  Código: 'Code',
  'Registros período': 'Dossiers de la période',
  Próximos: 'À venir',
  Indicador: 'Indicateur',
  Valor: 'Valeur',
  Stock: 'Stock',
  Unidad: 'Unité',
  'Caballos activos': 'Chevaux actifs',
  'Atenciones próximas': 'Soins à venir',
  'Reservas canceladas': 'Réservations annulées',
  'Cupos disponibles': 'Capacité disponible',
  'Insumos con stock bajo': 'Articles en stock faible',
  'Reservas del período': 'Réservations de la période',
  Cancelaciones: 'Annulations',
  'Próxima fecha': 'Prochaine date',
  Eventos: 'Événements',
  VENCIDO: 'EN RETARD',
  BAJO: 'FAIBLE',
  DISPONIBLE: 'DISPONIBLE',
  PRÓXIMO: 'À VENIR',
  'SIN PLAN': 'SANS PLAN',
  CUBIERTO: 'COUVERT',
  'AL DÍA': 'À JOUR',
  INACTIVO: 'INACTIF',
  SCHEDULED: 'Planifiée',
  CANCELLED: 'Annulée',
  ADMIN: 'Administrateur',
  CAREGIVER: 'Soigneur',
  VETERINARIAN: 'Vétérinaire',
  CLIENT: 'Client',
  FARRIER: 'Maréchal-ferrant',
  ADMINISTRATOR: 'Administrateur',
  PASEO: 'Promenade',
  MONTA: 'Monte',
  ENTRENAMIENTO: 'Entraînement',
  VETERINARIA: 'Rendez-vous vétérinaire',
  'Vacunación próxima': 'Vaccination prochaine',
  'Seguimiento de tratamiento': 'Suivi du traitement',
  'Tratamiento vencido': 'Traitement en retard',
  'Control médico próximo': 'Contrôle médical prochain',
  'Las contraseñas no coinciden': 'Les mots de passe ne correspondent pas',
  'Credenciales incorrectas': 'Identifiants incorrects',
  'Datos inválidos': 'Données non valides',
  Inválido: 'Non valide',
  'El correo ya está registrado': 'L’e-mail est déjà enregistré',
  'El identificador ya existe': 'L’identifiant existe déjà',
  'Debe seleccionar una imagen': 'Vous devez sélectionner une image',
  'Formato no permitido. Use JPG, PNG o WebP':
    'Format non pris en charge. Utilisez JPG, PNG ou WebP',
  'La imagen no puede superar 5 MB': 'L’image ne peut pas dépasser 5 Mo',
  'No se pudo guardar la imagen': 'Impossible d’enregistrer l’image',
  'No se pudo guardar la imagen en la nube':
    'Impossible d’enregistrer l’image dans le nuage',
  'El enlace no es válido o ya venció': 'Le lien n’est pas valide ou a expiré',
  'La fecha inicial no puede ser posterior a la final':
    'La date de début ne peut pas être postérieure à la date de fin',
  'El período del reporte no puede superar un año':
    'La période du rapport ne peut pas dépasser un an',
  'La hora final debe ser posterior a la inicial':
    'L’heure de fin doit être postérieure à l’heure de début',
  'El cupo solicitado supera la capacidad disponible':
    'Le nombre demandé dépasse la capacité disponible',
  'El caballo ya tiene una reserva en ese horario':
    'Le cheval a déjà une réservation à cette heure',
  'No hay existencias suficientes para registrar la salida':
    'Le stock est insuffisant pour enregistrer la sortie',
  'No se puede revertir el movimiento porque produciría stock negativo':
    'Le mouvement ne peut pas être annulé car il créerait un stock négatif',
  'Insumo no encontrado': 'Article introuvable',
  'Movimiento no encontrado': 'Mouvement introuvable',
  'Plan no encontrado': 'Plan introuvable',
  'Usuario no encontrado': 'Utilisateur introuvable',
  'Debe existir al menos un administrador activo':
    'Il doit rester au moins un administrateur actif',
  'La operación incumple una regla de integridad de datos':
    'L’opération enfreint une règle d’intégrité des données',
  'Si el correo está registrado, recibirá instrucciones para restablecer su contraseña':
    'Si l’e-mail est enregistré, vous recevrez les instructions de réinitialisation',
  'Alimentación, limpieza y revisión de establos':
    'Alimentation, nettoyage et inspection des écuries',
  'Consultas, vacunación y seguimiento clínico':
    'Consultations, vaccination et suivi clinique',
  'Tratamientos y emergencias veterinarias':
    'Traitements et urgences vétérinaires',
  'Herraje, cascos y mantenimiento preventivo':
    'Ferrage, soins des sabots et entretien préventif',
  'Alimentación vespertina y supervisión':
    'Alimentation du soir et supervision',
  'Heno premium': 'Foin premium',
  Desparasitante: 'Vermifuge',
  'Avena integral': 'Avoine complète',
  'Concentrado deportivo': 'Aliment de performance',
  'Suplemento vitamínico': 'Complément vitaminé',
  'Botiquín veterinario': 'Trousse vétérinaire',
  'Champú equino': 'Shampooing équin',
  'Herraduras estándar': 'Fers standard',
  'Vacuna influenza': 'Vaccin contre la grippe',
  dosis: 'doses',
  frascos: 'flacons',
  kits: 'kits',
  litros: 'litres',
  unidades: 'unités',
  'Pura Raza Española': 'Pure race espagnole',
  Andaluz: 'Andalou',
  'Cuarto de Milla': 'Quarter Horse',
  Percherón: 'Percheron',
  Árabe: 'Arabe',
  'Refuerzo anual contra influenza': 'Rappel annuel contre la grippe',
  'Sin reacciones adversas': 'Aucune réaction indésirable',
  'Tratamiento antiinflamatorio de miembro anterior':
    'Traitement anti-inflammatoire du membre antérieur',
  'Evolución favorable': 'Évolution favorable',
  'Sensibilidad confirmada a penicilina':
    'Sensibilité confirmée à la pénicilline',
  'Usar antibiótico alternativo': 'Utiliser un antibiotique alternatif',
  'Vacunación contra tétanos': 'Vaccination contre le tétanos',
  'Esquema actualizado': 'Programme à jour',
  'Control odontológico semestral': 'Contrôle dentaire semestriel',
  'Desgaste normal': 'Usure normale',
  'Limpieza y cuidado preventivo de cascos':
    'Nettoyage et soins préventifs des sabots',
  'Revisar herraje en próxima visita':
    'Vérifier le ferrage lors de la prochaine visite',
  'Refuerzo anual de vacuna contra influenza':
    'Rappel annuel du vaccin contre la grippe',
  'Aplicar durante la próxima visita':
    'Administrer lors de la prochaine visite',
  'Cierre de tratamiento digestivo': 'Fin du traitement digestif',
  'Tratamiento vencido pendiente de revisión':
    'Traitement en retard en attente de révision',
  'Dividir en dos porciones': 'Diviser en deux portions',
  'Complementar con agua fresca': 'Compléter avec de l’eau fraîche',
  'Ración de mantenimiento': 'Ration d’entretien',
  'Previo al entrenamiento': 'Avant l’entraînement',
  'Agregar suplemento vitamínico': 'Ajouter un complément vitaminé',
  'Dieta baja en azúcares': 'Régime pauvre en sucres',
  'Ración para caballo de tiro': 'Ration pour cheval de trait',
  'Monitorear ganancia de peso': 'Surveiller la prise de poids',
  'Recepción semanal de proveedor': 'Livraison hebdomadaire du fournisseur',
  'Consumo diario de alimentación': 'Consommation alimentaire quotidienne',
  'Tratamiento preventivo': 'Traitement préventif',
  'Trabajo de doma avanzada': 'Travail de dressage avancé',
  'Paseo guiado de una hora': 'Promenade guidée d’une heure',
  'Control general programado': 'Contrôle général programmé',
  'Clase de nivel intermedio': 'Cours de niveau intermédiaire',
  'Adaptación a pista exterior': 'Adaptation à la carrière extérieure',
  'Paseo recreativo supervisado': 'Promenade récréative supervisée',
};

const dictionaries = { en: { ...EN, ...EN_EXTRA }, fr: { ...FR, ...FR_EXTRA } };
const textState = new WeakMap(),
  attributeState = new WeakMap();
const preserveWhitespace = (source, value) =>
  source.match(/^\s*/)[0] + value + source.match(/\s*$/)[0];

export function translateText(value, language) {
  if (!value || language === 'es') return value;
  const source = String(value),
    trimmed = source.trim(),
    exact = dictionaries[language]?.[trimmed];
  if (exact) return preserveWhitespace(source, exact);
  const greeting = trimmed.match(/^Buenos días, (.+)$/);
  if (greeting) {
    const person = translateText(greeting[1], language).trim();
    return preserveWhitespace(
      source,
      language === 'en' ? `Good morning, ${person}` : `Bonjour, ${person}`
    );
  }
  const patterns =
    language === 'en'
      ? [
          [/^(\d+) registros?$/, '$1 records'],
          [/^(\d+) ejemplares?$/, '$1 horses'],
          [/^Fotografía de (.+)$/, 'Photo of $1'],
          [/^Editar (.+)$/, 'Edit $1'],
          [/^Eliminar (.+)$/, 'Delete $1'],
          [/^Rol de (.+)$/, 'Role of $1'],
        ]
      : [
          [/^(\d+) registros?$/, '$1 enregistrements'],
          [/^(\d+) ejemplares?$/, '$1 chevaux'],
          [/^Fotografía de (.+)$/, 'Photo de $1'],
          [/^Editar (.+)$/, 'Modifier $1'],
          [/^Eliminar (.+)$/, 'Supprimer $1'],
          [/^Rol de (.+)$/, 'Rôle de $1'],
        ];
  for (const [pattern, replacement] of patterns)
    if (pattern.test(trimmed))
      return preserveWhitespace(source, trimmed.replace(pattern, replacement));
  const inventoryAlert = trimmed.match(/^(.+) tiene ([^;]+); mínimo: (.+)$/);
  if (inventoryAlert) {
    const item = translateText(inventoryAlert[1], language).trim(),
      measure = inventoryAlert[2].replace(/\S+$/, (unit) =>
        translateText(unit, language).trim()
      ),
      translated =
        language === 'en'
          ? `${item} has ${measure}; minimum: ${inventoryAlert[3]}`
          : `${item} a ${measure} ; minimum : ${inventoryAlert[3]}`;
    return preserveWhitespace(source, translated);
  }
  const detailedAlert = trimmed.match(/^([^:]+): (.+?)( · .+)$/);
  if (detailedAlert) {
    const detail = translateText(detailedAlert[2], language).trim();
    if (detail !== detailedAlert[2])
      return preserveWhitespace(
        source,
        `${detailedAlert[1]}: ${detail}${detailedAlert[3]}`
      );
  }
  const list = trimmed.split(', ');
  if (list.length > 1) {
    const translated = list.map((item) => translateText(item, language).trim());
    if (translated.some((item, index) => item !== list[index]))
      return preserveWhitespace(source, translated.join(', '));
  }
  const auditDetail = trimmed.match(/^(.+) en (.+)$/);
  if (auditDetail) {
    const action = translateText(auditDetail[1], language).trim(),
      resource = translateText(auditDetail[2], language).trim();
    if (action !== auditDetail[1] || resource !== auditDetail[2])
      return preserveWhitespace(
        source,
        language === 'en'
          ? `${action} in ${resource}`
          : `${action} dans ${resource}`
      );
  }
  return value;
}

function translateNode(node, language) {
  if (node.nodeType === 3) {
    if (
      !node.parentElement ||
      node.parentElement.closest('[data-i18n-ignore]') ||
      ['SCRIPT', 'STYLE'].includes(node.parentElement.tagName)
    )
      return;
    const current = node.nodeValue,
      state = textState.get(node);
    const source =
      !state || (current !== state.last && current !== state.source)
        ? current
        : state.source;
    const translated = translateText(source, language);
    textState.set(node, { source, last: translated });
    if (current !== translated) node.nodeValue = translated;
    return;
  }
  if (node.nodeType !== 1 || node.closest?.('[data-i18n-ignore]')) return;
  for (const attribute of ['placeholder', 'aria-label', 'title', 'alt'])
    if (node.hasAttribute?.(attribute)) {
      const current = node.getAttribute(attribute),
        states = attributeState.get(node) || {},
        state = states[attribute],
        source =
          !state || (current !== state.last && current !== state.source)
            ? current
            : state.source,
        translated = translateText(source, language);
      states[attribute] = { source, last: translated };
      attributeState.set(node, states);
      if (current !== translated) node.setAttribute(attribute, translated);
    }
  for (const child of node.childNodes) translateNode(child, language);
}

const I18nContext = createContext({
  language: 'es',
  setLanguage: () => {},
  locale: LOCALES.es,
  t: (value) => value,
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('language') || 'es'
  );
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    translateNode(document.body, language);
    const observer = new MutationObserver((mutations) =>
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData')
          translateNode(mutation.target, language);
        else
          mutation.addedNodes.forEach((node) => translateNode(node, language));
      })
    );
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });
    const nativeConfirm = window.confirm;
    window.confirm = (message) =>
      nativeConfirm(translateText(message, language));
    return () => {
      observer.disconnect();
      window.confirm = nativeConfirm;
    };
  }, [language]);
  const value = useMemo(
    () => ({
      language,
      setLanguage,
      locale: LOCALES[language],
      t: (text) => translateText(text, language),
    }),
    [language]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

export function LanguageSelector({ className = '' }) {
  const { language, setLanguage, t } = useI18n();
  return (
    <label className={`language-control ${className}`} title={t('Idioma')}>
      <Languages size={16} />
      <select
        aria-label={t('Idioma')}
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
        <option value="fr">FR</option>
      </select>
    </label>
  );
}
