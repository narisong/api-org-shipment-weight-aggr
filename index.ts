const express = require('express')
const bodyParser = require("body-parser");
let { isUnitValid, convertWeight } = require('./utils.ts');

const app = express()
app.use(bodyParser.json());
const port = 3000

const DEFAULT_UNIT: string = 'KILOGRAMS';

interface Organization {
  id: string;
  code: string;
}

interface TotalWeight {
  weight: number;
  unit: string; // this could be an enum
}

interface Node {
  totalWeight: TotalWeight;
}

interface TransportPacks {
  nodes: Node[];
}

interface Shipment {
  // It was not clear in the requirement which property represents the id of a shipment. Here I'm assuming it is referenceId.
  referenceId: string;
  organizations: string[];
  transportPacks: TransportPacks;
}

// These are in-memory. We can use a database if we want "real" persistence.
const orgs: Map<string, Organization> = new Map<string, Organization>();
const shipments: Map<string, Shipment> = new Map<string, Shipment>();

/**
 * The logic for shipment and organization apis is very similar. For this exercise,
 * since the implementation is not complex, I just repeated the logic in both places.
 * As the complexity increases, or the number of api entities increases, we should
 * extract and re-use common logic.
 */

// I'm only doing a basic validation on the type. In real world scenarios, we should have a more robust validation framework, like auth, media content type validation, etc.
app.post('/shipment', async (req: any, res: any) => {
  if (req.body.type != 'SHIPMENT') {
    return res.status(400).send('the request content must be of \'SHIPMENT\' type');
  }

  // In this exercise, I assume the parsing will always succeed. In a real system, we should catch any parsing error and return that to client.
  const shipment: Shipment = JSON.parse(JSON.stringify(req.body));
  shipments.set(shipment.referenceId, shipment);
  return res.status(200).send();
})

// Similarly, only basic validation.
app.post('/organization', (req: any, res: any) => {
  if (req.body.type != 'ORGANIZATION') {
    return res.status(400).send('the request content must be of \'ORGANIZATION\' type');
  }

  // Similarly, assuming parsing is always successful.
  const org: Organization = JSON.parse(JSON.stringify(req.body));
  orgs.set(org.id, org);
  return res.status(200).send();
})

app.get('/shipments/:shipmentId', (req: any, res: any) => {
  const shipmentId: string = req.params.shipmentId;
  if (!shipments.has(shipmentId)) {
    return res.status(404).send('shipment was not found');
  }

  return res.status(200).send(shipments.get(shipmentId));
})

app.get('/organizations/:organizationId', (req: any, res: any) => {
  const orgId: string = req.params.organizationId;
  if (!orgs.has(orgId)) {
    return res.status(404).send('organization was not found');
  }

  return res.status(200).send(orgs.get(orgId));
})

app.get('/totalWeight', (req: any, res: any) => {
  // Alternatively, we can throw 400 if target unit was not provided by client.
  const targetUnit: string = req.query.unit ?? DEFAULT_UNIT;

  if (!isUnitValid(targetUnit)) {
    return res.status(400).send('unit is invalid or not supported');
  }

  let totalWeight: number = 0;
  // Nested 'reduce' is a little hard to read. So I'm using forEach for outer loop.
  shipments.forEach(s => {
    const weight: number = s.transportPacks.nodes.reduce((previous: number, current: Node) => previous + convertWeight(current.totalWeight.weight, current.totalWeight.unit, targetUnit), 0);
    totalWeight += weight;
  })

  /**
   * There is a difference between
   * 1. No shipment
   * 2. The total weight of all shipments is 0
   * although both returns 0 on this api.
   * We might need to consider a better way of differentiating #1 and #2 in the response.
   * */
  return res.status(200).send({ weight: totalWeight, unit: targetUnit });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

export { };
