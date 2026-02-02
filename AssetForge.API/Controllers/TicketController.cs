using AssetForge.Application.DTOs.Tickets;
using AssetForge.Application.Interfaces.Tickets;
using AssetForge.Application.Models;
using AssetForge.Infrastructure.Data;
using AssetForge.Infrastructure.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AssetForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _service;

        public TicketController(ITicketService service)
        {
            _service = service;
        }

        // GET

        [HttpGet]
        public async Task<IActionResult> GetTickets()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicket(int id)
        {
            var ticket = await _service.GetByIdAsync(id);
            return ticket == null ? NotFound() : Ok(ticket);
        }

        [HttpGet("query")]
        public async Task<IActionResult> QueryTickets([FromQuery] QueryParameters p)
        {
            return Ok(await _service.QueryAsync(p));
        }

        [HttpGet("mine")]
        public async Task<IActionResult> GetMyTickets()
        {
            var userId = int.Parse(User.FindFirst("id")!.Value);
            return Ok(await _service.GetTicketsForUserAsync(userId));
        }

        [HttpGet("queue")]
        public async Task<IActionResult> GetTechnicianQueue()
        {
            var techId = int.Parse(User.FindFirst("id")!.Value);
            return Ok(await _service.GetTechnicianQueueAsync(techId));
        }

        // POST

        [HttpPost]
        public async Task<IActionResult> CreateTicket(TicketCreateDTO dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            return Ok(await _service.CreateAsync(dto, userId));
        }

        // PUT

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, TicketUpdateDTO dto)
            => Ok(await _service.UpdateAsync(id, dto));

        [HttpPut("{id}/assign/{techId}")]
        public async Task<IActionResult> AssignTicket(int id, int techId)
        {
            await _service.AssignToTechnicianAsync(id, techId);
            return Ok();
        }

        // DELETE

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
            => await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
