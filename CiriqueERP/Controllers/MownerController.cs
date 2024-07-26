﻿using CiriqueERP.Models;
using Microsoft.AspNetCore.Mvc;
using CiriqueERP.Data;

namespace CiriqueERP.Controllers
{
    [Route("api/controller")]
    [ApiController]
    public class MownerController : ControllerBase
    {
        private readonly MasterContext _context;
        private readonly IConfiguration _configuration;

        public MownerController(MasterContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("Mowners")]
        public IActionResult GetVessels([FromBody] MownerModel model)
        {
            if (model.CompNo == 0)
            {
                return BadRequest("Invalid company number");
            }

            Console.WriteLine($"Received API call with Company Number: {model.CompNo}");

            var vessels = _context.Mowner
                .Where(u => u.CompNo == model.CompNo)
                .Select(u => new
                {
                    u.ID,
                    u.VesselName,
                    u.CompNo,
                    u.OpenedDate,
                    u.Status,
                    u.Description,
                    u.DocNo,
                    u.Tasks,
                    u.ExtendedDate,
                    u.DueDate,
                    u.ClosedDate,
                    u.Human,
                    u.System,
                    u.Material,
                    u.Subject,
                    u.Remarks
                })
                .ToList();

            if (!vessels.Any())
            {
                return NotFound("No vessels found for the given company number");
            }

            return Ok(vessels);
        }

        [HttpPost("addMowner")]
        public IActionResult AddVessel([FromBody] AddMownerModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            DateTime openedDate;
            if (!DateTime.TryParse(model.OpenedDate, out openedDate))
            {
                // Varsayılan bir tarih atayın (örneğin: bugünün tarihi)
                openedDate = DateTime.Now;
            }

            DateTime dueDate;
            if (!DateTime.TryParse(model.DueDate, out dueDate))
            {
                dueDate = DateTime.Now;
            }

            DateTime extendedDate;
            if (!DateTime.TryParse(model.ExtendedDate, out extendedDate))
            {
                extendedDate = DateTime.Now;
            }

            DateTime closedDate;
            if (!DateTime.TryParse(model.ClosedDate, out closedDate))
            {
                closedDate = DateTime.Now;
            }

            var newVessel = new Mowner
            {
                VesselName = model.VesselName,
                CompNo = model.CompNo,
                OpenedDate = openedDate,
                DueDate = dueDate,
                ExtendedDate = extendedDate,
                ClosedDate = closedDate,
                Status = model.Status,
                Description = model.Description,
                DocNo = model.DocNo,
                Tasks = model.Tasks,
                Human = model.Human,
                System = model.System,
                Material = model.Material,
                Subject = model.Subject,
                Remarks = model.Remarks
            };

            _context.Mowner.Add(newVessel);
            _context.SaveChanges();

            return Ok(new { Message = "Vessel added successfully" });
        }

        [HttpDelete("deleteMowner/{id}")]
        public IActionResult DeleteVessel(int id)
        {
            var vessel = _context.Mowner.FirstOrDefault(v => v.ID == id);
            if (vessel == null)
            {
                return NotFound("Vessel not found");
            }

            _context.Mowner.Remove(vessel);
            _context.SaveChanges();
            return Ok();
        }
        
    }

    public class MownerModel
    {
        public int CompNo { get; set; }
    }

    public class AddMownerModel
    {
        public string VesselName { get; set; }
        public int CompNo { get; set; }
        public string OpenedDate { get; set; }
        public string DueDate { get; set; }
        public string? ExtendedDate { get; set; }
        public string? ClosedDate { get; set; }
        public int Status { get; set; }
        public string Description { get; set; }
        public string DocNo { get; set; }
        public int Tasks { get; set; }
        public bool Human { get; set; }
        public bool System { get; set; }
        public bool Material { get; set; }
        public string Subject { get; set; }
        public string Remarks { get; set; }
    }
}