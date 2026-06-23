package com.establo.service;

import com.establo.dto.ReservationDto;
import com.establo.exception.BusinessException;
import com.establo.repository.ReservationRepository;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class ReservationServiceTest {
  @Test void rejectsEndTimeBeforeStartTime() {
    var repository = mock(ReservationRepository.class);
    var service = new ReservationService(repository, mock(HorseService.class));
    var start = LocalDateTime.now().plusDays(1);
    var request = new ReservationDto(null, 1L, null, start, start.minusHours(1), "MONTA", "Cliente", null, null, 1, 1);

    assertThatThrownBy(() -> service.create(request))
        .isInstanceOf(BusinessException.class)
        .hasMessageContaining("hora final");
    verify(repository, never()).save(any());
  }

  @Test void rejectsParticipantsAboveCapacity() {
    var repository = mock(ReservationRepository.class);
    var service = new ReservationService(repository, mock(HorseService.class));
    var start = LocalDateTime.now().plusDays(1);
    var request = new ReservationDto(null, 1L, null, start, start.plusHours(1), "PASEO", "Cliente", null, null, 4, 5);
    assertThatThrownBy(() -> service.create(request)).isInstanceOf(BusinessException.class).hasMessageContaining("cupo");
    verify(repository, never()).save(any());
  }
}
