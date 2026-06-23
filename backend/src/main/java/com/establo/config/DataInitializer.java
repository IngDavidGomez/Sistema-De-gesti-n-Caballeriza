package com.establo.config;

import com.establo.entity.*;
import com.establo.repository.*;
import com.establo.dto.EmployeeDto;
import com.establo.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
  private final UserRepository users;
  private final HorseRepository horses;
  private final EmployeeRepository employees;
  private final EmployeeService employeeService;
  private final InventoryItemRepository inventory;
  private final MedicalRecordRepository medicalRecords;
  private final ReservationRepository reservations;
  private final FeedingPlanRepository feedingPlans;
  private final SupplyRecordRepository supplyRecords;
  private final PasswordEncoder encoder;

  @Override
  public void run(String... args) {
    seedUsers();
    seedEmployees();
    seedInventory();
    seedOperationalData();
    seedSupplyRecords();
  }

  private void seedSupplyRecords() {
    if (supplyRecords.count() > 0) return;
    var items=inventory.findAll();
    if(items.size()<2)return;
    supplyRecords.save(SupplyRecord.builder().item(items.get(0)).date(LocalDateTime.now().minusDays(3)).type("IN").quantity(40d).responsible("Ana Morales").notes("Recepción semanal de proveedor").build());
    supplyRecords.save(SupplyRecord.builder().item(items.get(0)).date(LocalDateTime.now().minusDays(1)).type("OUT").quantity(12d).responsible("Sofía Ramírez").notes("Consumo diario de alimentación").build());
    supplyRecords.save(SupplyRecord.builder().item(items.get(1)).date(LocalDateTime.now().minusDays(2)).type("OUT").quantity(2d).responsible("Dra. Elena Vargas").notes("Tratamiento preventivo").build());
  }

  private void seedUsers() {
    // Se conserva exactamente un usuario administrador.
    ensureUser("Administrador", "admin@establo.cr", "Admin123!", Role.ADMIN);
    ensureUser("Dra. Elena Vargas", "vet@establo.cr", "Vet12345!", Role.VETERINARIAN);
    ensureUser("Sofía Ramírez", "cuidador@establo.cr", "Cuidador123!", Role.CAREGIVER);
    ensureUser("Diego Fernández", "cliente@establo.cr", "Cliente123!", Role.CLIENT);
  }

  private void seedEmployees() {
    ensureEmployee("Ana Morales", EmployeeRole.CAREGIVER, "ana@establo.cr", "06:00 - 14:00", "Alimentación, limpieza y revisión de establos");
    ensureEmployee("Dra. Elena Vargas", EmployeeRole.VETERINARIAN, "elena@establo.cr", "08:00 - 16:00", "Consultas, vacunación y seguimiento clínico");
    ensureEmployee("Carlos Méndez", EmployeeRole.VETERINARIAN, "carlos@establo.cr", "10:00 - 18:00", "Tratamientos y emergencias veterinarias");
    ensureEmployee("Miguel Salas", EmployeeRole.FARRIER, "miguel@establo.cr", "07:00 - 15:00", "Herraje, cascos y mantenimiento preventivo");
    ensureEmployee("Sofía Ramírez", EmployeeRole.CAREGIVER, "sofia@establo.cr", "14:00 - 22:00", "Alimentación vespertina y supervisión");
  }

  private void seedInventory() {
    ensureItem("Heno premium", "Alimento", 24d, 30d, "kg");
    ensureItem("Desparasitante", "Medicina", 12d, 5d, "dosis");
    ensureItem("Avena integral", "Alimento", 85d, 25d, "kg");
    ensureItem("Concentrado deportivo", "Alimento", 42d, 20d, "kg");
    ensureItem("Suplemento vitamínico", "Medicina", 8d, 10d, "frascos");
    ensureItem("Botiquín veterinario", "Medicina", 4d, 3d, "kits");
    ensureItem("Champú equino", "Limpieza", 15d, 5d, "litros");
    ensureItem("Herraduras estándar", "Equipo", 28d, 12d, "unidades");
    ensureItem("Vacuna influenza", "Medicina", 6d, 8d, "dosis");
  }

  private void seedOperationalData() {
    var relampago = ensureHorse("CAB-001", "Relámpago", LocalDate.of(2018, 4, 12), "Pura Raza Española", "Macho", 480d);
    var luna = ensureHorse("CAB-002", "Luna", LocalDate.of(2020, 8, 3), "Criollo", "Hembra", 420d);
    var trueno = ensureHorse("CAB-003", "Trueno", LocalDate.of(2017, 2, 18), "Andaluz", "Macho", 505d);
    var canela = ensureHorse("CAB-004", "Canela", LocalDate.of(2019, 11, 7), "Cuarto de Milla", "Hembra", 455d);
    var spirit = ensureHorse("CAB-005", "Spirit", LocalDate.of(2021, 5, 21), "Appaloosa", "Macho", 438d);
    var estrella = ensureHorse("CAB-006", "Estrella", LocalDate.of(2016, 9, 14), "Paso Fino", "Hembra", 410d);
    var titan = ensureHorse("CAB-007", "Titán", LocalDate.of(2015, 1, 30), "Percherón", "Macho", 780d);
    var aurora = ensureHorse("CAB-008", "Aurora", LocalDate.of(2022, 3, 9), "Árabe", "Hembra", 395d);

    ensureMedical(relampago, LocalDate.now().minusDays(45), "VACUNA", "Refuerzo anual contra influenza", "Dra. Elena Vargas", LocalDate.now().plusDays(320), "Sin reacciones adversas");
    ensureMedical(luna, LocalDate.now().minusDays(12), "TRATAMIENTO", "Tratamiento antiinflamatorio de miembro anterior", "Dr. Carlos Méndez", LocalDate.now().plusDays(5), "Evolución favorable");
    ensureMedical(trueno, LocalDate.now().minusDays(80), "ALERGIA", "Sensibilidad confirmada a penicilina", "Dra. Elena Vargas", null, "Usar antibiótico alternativo");
    ensureMedical(canela, LocalDate.now().minusDays(25), "VACUNA", "Vacunación contra tétanos", "Dra. Elena Vargas", LocalDate.now().plusDays(340), "Esquema actualizado");
    ensureMedical(estrella, LocalDate.now().minusDays(8), "OBSERVACIÓN", "Control odontológico semestral", "Dr. Carlos Méndez", LocalDate.now().plusMonths(6), "Desgaste normal");
    ensureMedical(titan, LocalDate.now().minusDays(20), "TRATAMIENTO", "Limpieza y cuidado preventivo de cascos", "Miguel Salas", LocalDate.now().plusDays(25), "Revisar herraje en próxima visita");
    ensureMedical(aurora, LocalDate.now().minusMonths(11), "VACUNA", "Refuerzo anual de vacuna contra influenza", "Dra. Elena Vargas", LocalDate.now().plusDays(14), "Aplicar durante la próxima visita");
    ensureMedical(spirit, LocalDate.now().minusDays(18), "TRATAMIENTO", "Cierre de tratamiento digestivo", "Dr. Carlos Méndez", LocalDate.now().minusDays(2), "Tratamiento vencido pendiente de revisión");

    ensureFeeding(relampago, "Concentrado deportivo", 3.5d, "kg", LocalTime.of(6, 30), "Dividir en dos porciones");
    ensureFeeding(luna, "Heno premium", 5d, "kg", LocalTime.of(7, 0), "Complementar con agua fresca");
    ensureFeeding(trueno, "Avena integral", 3d, "kg", LocalTime.of(7, 30), "Ración de mantenimiento");
    ensureFeeding(canela, "Concentrado deportivo", 2.5d, "kg", LocalTime.of(8, 0), "Previo al entrenamiento");
    ensureFeeding(spirit, "Heno premium", 4.5d, "kg", LocalTime.of(6, 45), "Agregar suplemento vitamínico");
    ensureFeeding(estrella, "Avena integral", 2d, "kg", LocalTime.of(7, 15), "Dieta baja en azúcares");
    ensureFeeding(titan, "Heno premium", 8d, "kg", LocalTime.of(6, 0), "Ración para caballo de tiro");
    ensureFeeding(aurora, "Concentrado deportivo", 2d, "kg", LocalTime.of(8, 15), "Monitorear ganancia de peso");

    ensureReservation(relampago, 1, 9, "ENTRENAMIENTO", "Jorge Castillo", "Trabajo de doma avanzada");
    ensureReservation(luna, 1, 15, "PASEO", "María González", "Paseo guiado de una hora");
    ensureReservation(trueno, 2, 10, "VETERINARIA", "Dra. Elena Vargas", "Control general programado");
    ensureReservation(canela, 3, 8, "MONTA", "Diego Fernández", "Clase de nivel intermedio");
    ensureReservation(spirit, 4, 16, "ENTRENAMIENTO", "Sofía Ramírez", "Adaptación a pista exterior");
    ensureReservation(aurora, 5, 11, "PASEO", "Laura Jiménez", "Paseo recreativo supervisado");
  }

  private void ensureUser(String name, String email, String password, Role role) {
    if (users.findByEmailIgnoreCase(email).isEmpty()) {
      users.save(User.builder().name(name).email(email).password(encoder.encode(password)).role(role).build());
    }
  }

  private Horse ensureHorse(String code, String name, LocalDate birthDate, String breed, String sex, double weight) {
    var horse=horses.findAll().stream().filter(h -> h.getCode().equalsIgnoreCase(code)).findFirst()
        .orElseGet(() -> horses.save(Horse.builder().code(code).name(name).birthDate(birthDate).breed(breed).sex(sex).weight(weight).build()));
    if(horse.getPhotoUrl()==null||horse.getPhotoUrl().isBlank()){horse.setPhotoUrl("/demo-horses/"+switch(code){case "CAB-001"->"relampago.png";case "CAB-002"->"luna.png";case "CAB-003"->"trueno.png";case "CAB-004"->"canela.png";case "CAB-005"->"spirit.png";case "CAB-006"->"estrella.png";case "CAB-007"->"titan.png";default->"aurora.png";});horse=horses.save(horse);}
    return horse;
  }

  private void ensureEmployee(String name, EmployeeRole role, String contact, String shift, String tasks) {
    if (employees.findAll().stream().noneMatch(e -> e.getName().equalsIgnoreCase(name))) {
      employeeService.create(new EmployeeDto(null,name,role,contact,shift,tasks,true));
    }
  }

  private void ensureItem(String name, String category, double quantity, double minimum, String unit) {
    if (inventory.findAll().stream().noneMatch(i -> i.getName().equalsIgnoreCase(name))) {
      inventory.save(InventoryItem.builder().name(name).category(category).quantity(quantity).minimumStock(minimum).unit(unit).build());
    }
  }

  private void ensureMedical(Horse horse, LocalDate date, String type, String description, String responsible, LocalDate nextDueDate, String observations) {
    if (medicalRecords.findAll().stream().noneMatch(r -> r.getDescription().equalsIgnoreCase(description))) {
      medicalRecords.save(MedicalRecord.builder().horse(horse).date(date).type(type).description(description).responsible(responsible).nextDueDate(nextDueDate).observations(observations).build());
    }
  }

  private void ensureFeeding(Horse horse, String feed, double quantity, String unit, LocalTime time, String notes) {
    if (feedingPlans.findByHorseId(horse.getId()).stream().noneMatch(p -> p.getScheduleTime().equals(time))) {
      feedingPlans.save(FeedingPlan.builder().horse(horse).feedType(feed).quantity(quantity).unit(unit).scheduleTime(time).notes(notes).build());
    }
  }

  private void ensureReservation(Horse horse, int daysFromNow, int hour, String activity, String responsible, String observations) {
    var existing=reservations.findAll().stream().filter(r -> observations.equalsIgnoreCase(r.getObservations())).findFirst();
    if (existing.isPresent()) {
      var reservation=existing.get();
      if ("PASEO".equals(activity) && (reservation.getCapacity()==null || reservation.getCapacity()==1)) { reservation.setCapacity(6); reservation.setParticipants(1); reservations.save(reservation); }
    } else {
      LocalDateTime start = LocalDate.now().plusDays(daysFromNow).atTime(hour, 0);
      int capacity = "PASEO".equals(activity) ? 6 : 1;
      reservations.save(Reservation.builder().horse(horse).startAt(start).endAt(start.plusHours(1)).activityType(activity).responsible(responsible).status("SCHEDULED").observations(observations).capacity(capacity).participants(1).build());
    }
  }
}
