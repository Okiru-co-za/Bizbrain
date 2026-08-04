import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding BizBrain sample data (South Africa)')

  const tenant = await prisma.tenant.create({
    data: {
      name: 'BizBrain (SA) Ltd',
      domain: 'bizbrain.co.za'
    }
  })

  const owner = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'thabo@bizbrain.co.za',
      name: 'Thabo Mbeki',
      phone: '+27 82 555 1234',
      role: 'BUSINESS_OWNER'
    }
  })

  await prisma.subscription.create({
    data: {
      tenantId: tenant.id,
      planName: 'Starter',
      priceCents: 9900,
      currency: 'ZAR',
      status: 'active'
    }
  })

  const customer1 = await prisma.customer.create({
    data: {
      tenantId: tenant.id,
      name: 'Sizwe Mokoena',
      businessName: 'Sizwe & Sons Landscaping',
      industry: 'Landscaping',
      phone: '082 333 9876',
      email: 'info@sizwe-landscapes.co.za',
      address: '12 Garden Rd, Stellenbosch, Western Cape'
    }
  })

  const customer2 = await prisma.customer.create({
    data: {
      tenantId: tenant.id,
      name: 'Aisha Patel',
      businessName: 'Aisha Beauty Salon',
      industry: 'Salon',
      phone: '071 444 2211',
      email: 'contact@aishasalon.co.za',
      address: '45 Main St, Durban, KwaZulu-Natal'
    }
  })

  const lead1 = await prisma.lead.create({
    data: {
      tenantId: tenant.id,
      name: 'Greenfields Estate',
      businessName: 'Greenfields Estate',
      email: 'estate.manager@greenfields.co.za',
      phone: '021 555 7890',
      source: 'Website',
      industry: 'Construction',
      estimatedValue: 250000,
      status: 'NEW'
    }
  })

  const product1 = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      name: 'Standard Landscaping Package',
      description: 'Includes lawn preparation, planting and basic maintenance',
      unit: 'package',
      priceCents: 450000
    }
  })

  const opportunity1 = await prisma.opportunity.create({
    data: {
      tenantId: tenant.id,
      name: 'Greenfields Estate - Landscaping',
      description: 'Full estate landscaping and ongoing maintenance',
      amountCents: 450000,
      probability: 60
    }
  })

  const quote1 = await prisma.quote.create({
    data: {
      tenantId: tenant.id,
      customerId: customer1.id,
      opportunityId: opportunity1.id,
      status: 'DRAFT',
      totalCents: 450000,
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      createdById: owner.id,
      items: {
        create: [
          {
            productId: product1.id,
            description: 'Estate landscaping - standard package',
            quantity: 1,
            unitPriceCents: 450000
          }
        ]
      }
    }
  })

  const task1 = await prisma.task.create({
    data: {
      tenantId: tenant.id,
      title: 'Follow up with Greenfields Estate',
      description: 'Call to confirm site visit and measurements',
      assignedToId: owner.id,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
    }
  })

  await prisma.inboxItem.create({
    data: {
      tenantId: tenant.id,
      source: 'website_form',
      sender: 'estate.manager@greenfields.co.za',
      subject: 'Request for landscaping quote',
      message: 'Please provide an estimate for the estate common areas.',
      category: 'Quote request',
      priority: 'High'
    }
  })

  console.log('Seed complete. Tenant id:', tenant.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
