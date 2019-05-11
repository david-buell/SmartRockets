using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace SmartRockets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RocketController : ControllerBase
    {
        // GET api/rocket
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/rocket/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/rocket
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/rocket/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/rocket/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
