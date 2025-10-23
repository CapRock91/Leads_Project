package com.example.leads;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/leads")
public class LeadController {

    @Autowired
    private LeadRepository leadRepository;

    // GET all leads
    @GetMapping
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    // POST a new lead
    @PostMapping
    public Lead createLead(@RequestBody Lead lead) {
        lead.setCreatedAt(java.time.LocalDateTime.now());
        return leadRepository.save(lead);
    }

    // PUT (update a lead)
    @PutMapping("/{id}")
    public Lead updateLead(@PathVariable Long id, @RequestBody Lead updatedLead) {
        return leadRepository.findById(id).map(lead -> {
            lead.setName(updatedLead.getName());
            lead.setEmail(updatedLead.getEmail());
            lead.setPhone(updatedLead.getPhone());
            lead.setCompany(updatedLead.getCompany());
            lead.setSource(updatedLead.getSource());
            lead.setNotes(updatedLead.getNotes());
            return leadRepository.save(lead);
        }).orElseThrow(() -> new RuntimeException("Lead not found"));
    }

    // DELETE a lead
    @DeleteMapping("/{id}")
    public String deleteLead(@PathVariable Long id) {
        leadRepository.deleteById(id);
        return "Lead deleted successfully";
    }
}
