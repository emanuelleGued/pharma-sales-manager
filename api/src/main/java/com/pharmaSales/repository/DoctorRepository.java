package com.pharmaSales.repository;

import com.pharmaSales.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByNomeContainingIgnoreCaseOrEspecialidadeContainingIgnoreCaseOrderByNomeAsc(
            String nome, String especialidade);

    List<Doctor> findAllByOrderByNomeAsc();

    boolean existsByCrm(String crm);
}
