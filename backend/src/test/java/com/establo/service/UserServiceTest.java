package com.establo.service;
import com.establo.entity.*;import com.establo.exception.BusinessException;import com.establo.repository.UserRepository;import org.junit.jupiter.api.Test;import java.util.Optional;
import static org.assertj.core.api.Assertions.*;import static org.mockito.Mockito.*;
class UserServiceTest{
  UserRepository users=mock(UserRepository.class);UserService service=new UserService(users);
  @Test void protectsLastAdministrator(){var admin=User.builder().id(1L).role(Role.ADMIN).active(true).build();when(users.findById(1L)).thenReturn(Optional.of(admin));when(users.countByRole(Role.ADMIN)).thenReturn(1L);assertThatThrownBy(()->service.role(1L,Role.CAREGIVER)).isInstanceOf(BusinessException.class).hasMessageContaining("administrador");verify(users,never()).save(any());}
  @Test void allowsChangingRoleWhenAnotherAdminExists(){var admin=User.builder().id(1L).role(Role.ADMIN).active(true).build();when(users.findById(1L)).thenReturn(Optional.of(admin));when(users.countByRole(Role.ADMIN)).thenReturn(2L);when(users.save(admin)).thenReturn(admin);assertThat(service.role(1L,Role.CAREGIVER).role()).isEqualTo(Role.CAREGIVER);}
}
