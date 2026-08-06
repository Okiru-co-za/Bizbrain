import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function findOrCreateUser(tenantId: string, data: { email: string; name: string; phone?: string; role: any }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) return existing
  return prisma.user.create({ data: { tenantId, ...data } })
}

async function findOrCreateCustomer(tenantId: string, name: string, data: any) {
  const existing = await prisma.customer.findFirst({ where: { tenantId, name } })
  if (existing) return existing
  return prisma.customer.create({ data: { tenantId, name, ...data } })
}

async function main() {
  const tenant = await prisma.tenant.findFirst({ where: { name: 'BizBrain (SA) Ltd' } })
  if (!tenant) throw new Error('Seed tenant not found - run `npm run seed` first')
  const tenantId = tenant.id

  const owner = await prisma.user.findUnique({ where: { email: 'thabo@bizbrain.co.za' } })
  if (!owner) throw new Error('Seed owner not found - run `npm run seed` first')

  console.log('Adding extra staff users...')
  const lerato = await findOrCreateUser(tenantId, { email: 'lerato@bizbrain.co.za', name: 'Lerato Nkosi', phone: '083 222 4455', role: 'MANAGER' })
  const sipho = await findOrCreateUser(tenantId, { email: 'sipho@bizbrain.co.za', name: 'Sipho Dlamini', phone: '084 111 6677', role: 'SALES' })
  const naledi = await findOrCreateUser(tenantId, { email: 'naledi@bizbrain.co.za', name: 'Naledi Khumalo', phone: '072 999 3344', role: 'FINANCE' })
  const johan = await findOrCreateUser(tenantId, { email: 'johan@bizbrain.co.za', name: 'Johan van der Merwe', phone: '079 555 8899', role: 'OPERATIONS' })
  const staff = [owner, lerato, sipho, naledi, johan]

  console.log('Adding extra customers + contacts...')
  const mokoena = await findOrCreateCustomer(tenantId, 'Tumi Radebe', {
    businessName: 'Mokoena Studio', industry: 'Photography', phone: '061 234 5566',
    email: 'hello@mokoenastudio.co.za', address: '9 Church St, Cape Town, Western Cape'
  })
  const naledimedia = await findOrCreateCustomer(tenantId, 'Bongani Zulu', {
    businessName: 'Naledi Media', industry: 'Marketing Agency', phone: '082 777 1122',
    email: 'bongani@naledimedia.co.za', address: '210 Loop St, Cape Town, Western Cape'
  })
  const karoo = await findOrCreateCustomer(tenantId, 'Willem Botha', {
    businessName: 'Karoo Coffee Roasters', industry: 'Food & Beverage', phone: '073 456 7788',
    email: 'willem@karoocoffee.co.za', address: '4 Voortrekker Rd, Graaff-Reinet, Eastern Cape'
  })
  const ubuntu = await findOrCreateCustomer(tenantId, 'Nomvula Dube', {
    businessName: 'Ubuntu Tech Solutions', industry: 'IT Services', phone: '060 321 9900',
    email: '', address: '15 Rivonia Rd, Sandton, Gauteng'
  })

  const existingContacts = await prisma.contact.count({ where: { tenantId } })
  if (existingContacts === 0) {
    await prisma.contact.createMany({
      data: [
        { tenantId, customerId: mokoena.id, name: 'Tumi Radebe', email: 'hello@mokoenastudio.co.za', phone: '061 234 5566', role: 'Owner' },
        { tenantId, customerId: naledimedia.id, name: 'Bongani Zulu', email: 'bongani@naledimedia.co.za', phone: '082 777 1122', role: 'Owner' },
        { tenantId, customerId: karoo.id, name: 'Willem Botha', email: 'willem@karoocoffee.co.za', phone: '073 456 7788', role: 'Owner' },
        { tenantId, customerId: ubuntu.id, name: 'Nomvula Dube', phone: '060 321 9900', role: 'Owner' }
      ]
    })
  }

  console.log('Adding leads across the pipeline...')
  const existingLeads = await prisma.lead.count({ where: { tenantId } })
  if (existingLeads <= 1) {
    await prisma.lead.createMany({
      data: [
        { tenantId, name: 'Precious Mahlangu', businessName: 'Mahlangu Events', email: 'precious@mahlanguevents.co.za', phone: '071 222 3344', source: 'Referral', industry: 'Events', estimatedValue: 85000, score: 70, status: 'CONTACTED', assignedToId: sipho.id, nextActionAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2) },
        { tenantId, name: 'Riaan Kruger', businessName: 'Kruger Auto Repairs', email: 'riaan@krugerauto.co.za', phone: '083 444 5566', source: 'Website', industry: 'Automotive', estimatedValue: 42000, score: 55, status: 'QUALIFIED', assignedToId: sipho.id },
        { tenantId, name: 'Zanele Mthembu', businessName: 'Mthembu Legal', email: 'zanele@mthembulegal.co.za', phone: '082 888 9900', source: 'Cold call', industry: 'Legal', estimatedValue: 120000, score: 40, status: 'PROPOSAL_REQUIRED', assignedToId: lerato.id },
        { tenantId, name: 'Pieter Joubert', businessName: 'Joubert Wines', email: 'pieter@joubertwines.co.za', phone: '084 333 2211', source: 'Trade show', industry: 'Agriculture', estimatedValue: 300000, score: 80, status: 'QUOTE_SENT', assignedToId: owner.id },
        { tenantId, name: 'Ayanda Ngcobo', businessName: 'Ngcobo Consulting', email: 'ayanda@ngcoboconsulting.co.za', phone: '071 555 6677', source: 'Referral', industry: 'Consulting', estimatedValue: 65000, score: 60, status: 'NEGOTIATING', assignedToId: sipho.id },
        { tenantId, name: 'Frans Nel', businessName: 'Nel Logistics', email: 'frans@nellogistics.co.za', phone: '083 222 1100', source: 'Website', industry: 'Logistics', estimatedValue: 180000, score: 90, status: 'WON', assignedToId: owner.id },
        { tenantId, name: 'Busisiwe Khoza', businessName: 'Khoza Catering', email: 'busisiwe@khozacatering.co.za', phone: '072 333 4455', source: 'Social media', industry: 'Hospitality', estimatedValue: 30000, score: 20, status: 'LOST', assignedToId: lerato.id, notes: 'Went with a cheaper competitor' },
        { tenantId, name: 'Deon Fourie', businessName: 'Fourie Property Group', email: 'deon@fourieproperty.co.za', phone: '082 111 0099', source: 'Referral', industry: 'Real Estate', estimatedValue: 95000, score: 45, status: 'ON_HOLD', assignedToId: owner.id, notes: 'Paused until Q3 budget confirmed' }
      ]
    })
  }

  console.log('Adding opportunities...')
  const existingOpps = await prisma.opportunity.count({ where: { tenantId } })
  let opp2, opp3
  if (existingOpps <= 1) {
    opp2 = await prisma.opportunity.create({ data: { tenantId, customerId: naledimedia.id, name: 'Naledi Media - Retainer', description: 'Monthly marketing retainer', amountCents: 1850000, probability: 75, stage: 'Negotiation', expectedClose: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), assignedToId: sipho.id } })
    opp3 = await prisma.opportunity.create({ data: { tenantId, customerId: karoo.id, name: 'Karoo Coffee - POS rollout', description: 'Point-of-sale and inventory system for 3 branches', amountCents: 620000, probability: 40, stage: 'Discovery', expectedClose: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), assignedToId: lerato.id } })
    await prisma.opportunity.create({ data: { tenantId, customerId: ubuntu.id, name: 'Ubuntu Tech - Website + CRM', description: 'Full rebuild with CRM integration', amountCents: 950000, probability: 55, stage: 'Proposal', expectedClose: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18), assignedToId: owner.id } })
    await prisma.opportunity.create({ data: { tenantId, customerId: mokoena.id, name: 'Mokoena Studio - Booking site', description: 'Client booking + gallery site', amountCents: 180000, probability: 90, stage: 'Closed Won', expectedClose: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), assignedToId: sipho.id } })
  }

  console.log('Adding products...')
  const existingProducts = await prisma.product.count({ where: { tenantId } })
  let productBasic, productRetainer
  if (existingProducts <= 1) {
    productBasic = await prisma.product.create({ data: { tenantId, name: 'Website Care Plan', description: 'Monthly hosting, backups and support', unit: 'month', priceCents: 85000, taxRate: 15 } })
    productRetainer = await prisma.product.create({ data: { tenantId, name: 'Marketing Retainer', description: 'Ongoing social + content management', unit: 'month', priceCents: 1850000, taxRate: 15 } })
    await prisma.product.create({ data: { tenantId, name: 'POS Setup', description: 'Point-of-sale hardware + software install per branch', unit: 'branch', priceCents: 620000 / 3, taxRate: 15 } })
  } else {
    productBasic = await prisma.product.findFirst({ where: { tenantId, name: 'Website Care Plan' } })
    productRetainer = await prisma.product.findFirst({ where: { tenantId, name: 'Marketing Retainer' } })
  }

  console.log('Adding quotes...')
  const existingQuotes = await prisma.quote.count({ where: { tenantId } })
  if (existingQuotes <= 1 && productBasic && productRetainer) {
    await prisma.quote.create({ data: { tenantId, customerId: naledimedia.id, opportunityId: opp2?.id, status: 'SENT', totalCents: 1850000, validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), createdById: sipho.id, items: { create: [{ productId: productRetainer.id, description: 'Marketing retainer - monthly', quantity: 1, unitPriceCents: 1850000 }] } } })
    await prisma.quote.create({ data: { tenantId, customerId: karoo.id, opportunityId: opp3?.id, status: 'DRAFT', totalCents: 620000, validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21), createdById: lerato.id, items: { create: [{ productId: productBasic.id, description: 'POS rollout - phase 1', quantity: 1, unitPriceCents: 620000 }] } } })
    await prisma.quote.create({ data: { tenantId, customerId: mokoena.id, status: 'ACCEPTED', totalCents: 180000, validUntil: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), createdById: owner.id, items: { create: [{ description: 'Booking site build', quantity: 1, unitPriceCents: 180000 }] } } })
    await prisma.quote.create({ data: { tenantId, customerId: ubuntu.id, status: 'VIEWED', totalCents: 950000, validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12), createdById: owner.id, items: { create: [{ description: 'Website + CRM build', quantity: 1, unitPriceCents: 950000 }] } } })
    await prisma.quote.create({ data: { tenantId, customerId: karoo.id, status: 'EXPIRED', totalCents: 45000, validUntil: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), createdById: lerato.id, items: { create: [{ description: 'Menu board redesign', quantity: 1, unitPriceCents: 45000 }] } } })
  }

  console.log('Adding tasks...')
  const existingTasks = await prisma.task.count({ where: { tenantId } })
  if (existingTasks <= 1) {
    await prisma.task.createMany({
      data: [
        { tenantId, title: 'Onboard Naledi Media in workspace', description: 'Set up their account and share login', assignedToId: sipho.id, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), category: 'Onboarding', priority: 1, status: 'NOT_STARTED' },
        { tenantId, title: 'Send Karoo Coffee quote reminder', description: 'Quote expires in 3 weeks', customerId: karoo.id, assignedToId: lerato.id, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), category: 'Sales', priority: 2, status: 'NOT_STARTED' },
        { tenantId, title: 'Prepare Ubuntu Tech proposal deck', assignedToId: owner.id, dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24), category: 'Sales', priority: 1, status: 'IN_PROGRESS' },
        { tenantId, title: 'Review Q2 vendor spend', assignedToId: naledi.id, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), category: 'Finance', priority: 3, status: 'NOT_STARTED' },
        { tenantId, title: 'Fix invoicing PDF template', description: 'Logo is cut off on export', assignedToId: johan.id, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4), category: 'Operations', priority: 2, status: 'WAITING' },
        { tenantId, title: 'Confirm Mokoena Studio go-live date', customerId: mokoena.id, assignedToId: sipho.id, dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), category: 'Delivery', priority: 1, status: 'COMPLETED' },
        { tenantId, title: 'Chase overdue invoice INV-0001', assignedToId: naledi.id, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), category: 'Finance', priority: 1, status: 'NOT_STARTED' },
        { tenantId, title: 'Update team leave calendar', assignedToId: lerato.id, dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), category: 'HR', priority: 3, status: 'NOT_STARTED' }
      ]
    })
  }

  console.log('Adding inbox items...')
  const existingInbox = await prisma.inboxItem.count({ where: { tenantId } })
  if (existingInbox <= 1) {
    await prisma.inboxItem.createMany({
      data: [
        { tenantId, source: 'email', sender: 'bongani@naledimedia.co.za', subject: 'Re: retainer agreement', message: 'Happy to sign, please send the final PDF.', category: 'Sales', priority: 'High', sentiment: 'Positive', status: 'OPEN' },
        { tenantId, source: 'website_form', sender: 'willem@karoocoffee.co.za', subject: 'Question about POS pricing', message: 'Does the price include card machine hardware?', category: 'Sales', priority: 'Medium', sentiment: 'Neutral', status: 'OPEN' },
        { tenantId, source: 'whatsapp', sender: '060 321 9900', subject: 'Website down?', message: 'Our site looks broken on mobile, please check.', category: 'Support', priority: 'High', sentiment: 'Negative', status: 'OPEN' },
        { tenantId, source: 'email', sender: 'accounts@sizwe-landscapes.co.za', subject: 'Invoice query', message: 'Can we get 30 days terms instead of 14?', category: 'Finance', priority: 'Medium', sentiment: 'Neutral', status: 'RESOLVED' },
        { tenantId, source: 'email', sender: 'precious@mahlanguevents.co.za', subject: 'Thanks for the call', message: 'Looking forward to the proposal next week.', category: 'Sales', priority: 'Low', sentiment: 'Positive', status: 'OPEN' }
      ]
    })
  }

  console.log('Adding vendor billing emails (for the "scan inbox for subscriptions" feature)...')
  const existingVendorEmail = await prisma.inboxItem.findFirst({ where: { tenantId, sender: 'billing@aws.amazon.com' } })
  if (!existingVendorEmail) {
    await prisma.inboxItem.createMany({
      data: [
        { tenantId, source: 'email', sender: 'billing@aws.amazon.com', subject: 'Your AWS invoice is ready', message: 'Your AWS invoice for this billing period is $32.00. This is a recurring monthly charge on your account.', category: 'Finance', priority: 'Low', status: 'OPEN' },
        { tenantId, source: 'email', sender: 'billing@openai.com', subject: 'Your OpenAI API receipt', message: 'Thanks for using the OpenAI API. Your usage this month totaled $14.50, billed monthly.', category: 'Finance', priority: 'Low', status: 'OPEN' },
        { tenantId, source: 'email', sender: 'billing@figma.com', subject: 'Your Figma subscription renews soon', message: 'Your Figma Professional plan will renew on 2026-09-01 for $9.00 per month.', category: 'Finance', priority: 'Low', status: 'OPEN' }
      ]
    })
  }

  console.log('Adding documents...')
  const existingDocs = await prisma.document.count({ where: { tenantId } })
  if (existingDocs === 0) {
    await prisma.document.createMany({
      data: [
        { tenantId, url: 'https://example-files.bizbrain.co.za/naledi-media-retainer.pdf', filename: 'Naledi Media - Retainer Agreement.pdf', contentType: 'application/pdf' },
        { tenantId, url: 'https://example-files.bizbrain.co.za/karoo-coffee-pos-quote.pdf', filename: 'Karoo Coffee - POS Quote.pdf', contentType: 'application/pdf' },
        { tenantId, url: 'https://example-files.bizbrain.co.za/mokoena-studio-brand-brief.docx', filename: 'Mokoena Studio - Brand Brief.docx', contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
        { tenantId, url: 'https://example-files.bizbrain.co.za/team-org-chart.png', filename: 'Team Org Chart.png', contentType: 'image/png' }
      ]
    })
  }

  console.log('Adding leave requests...')
  const existingLeave = await prisma.leaveRequest.count({ where: { tenantId } })
  if (existingLeave === 0) {
    await prisma.leaveRequest.createMany({
      data: [
        { tenantId, userId: sipho.id, type: 'ANNUAL', startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18), reason: 'Family trip', status: 'PENDING' },
        { tenantId, userId: johan.id, type: 'SICK', startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), endDate: new Date(Date.now() - 1000 * 60 * 60 * 24), reason: 'Flu', status: 'PENDING' },
        { tenantId, userId: lerato.id, type: 'ANNUAL', startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40), endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35), reason: 'December break', status: 'APPROVED' },
        { tenantId, userId: naledi.id, type: 'UNPAID', startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), reason: 'Personal errand', status: 'REJECTED' }
      ]
    })
  }

  console.log('Adding time entries (last 7 weekdays, uneven coverage)...')
  const existingTimeEntries = await prisma.timeEntry.count({ where: { tenantId } })
  if (existingTimeEntries === 0) {
    const days: Date[] = []
    for (let i = 0; i < 10; i++) {
      const d = new Date()
      d.setUTCDate(d.getUTCDate() - i)
      const day = d.getUTCDay()
      if (day !== 0 && day !== 6) days.push(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())))
    }
    // Owner: full coverage, normal hours
    for (const d of days) {
      await prisma.timeEntry.create({ data: { tenantId, userId: owner.id, date: d, hoursWorked: 8 } })
    }
    // Lerato: full coverage but one unusual (13h) day
    for (let i = 0; i < days.length; i++) {
      await prisma.timeEntry.create({ data: { tenantId, userId: lerato.id, date: days[i], hoursWorked: i === 0 ? 13 : 8, notes: i === 0 ? 'Launch day crunch' : undefined } })
    }
    // Sipho: only logged the most recent 2 days (rest missing -> flags in HR overview)
    for (const d of days.slice(0, 2)) {
      await prisma.timeEntry.create({ data: { tenantId, userId: sipho.id, date: d, hoursWorked: 7.5 } })
    }
    // Naledi and Johan: no entries at all (fully missing)
  }

  console.log('Adding vendor subscriptions...')
  const existingSubs = await prisma.vendorSubscription.count({ where: { tenantId } })
  if (existingSubs === 0) {
    await prisma.vendorSubscription.createMany({
      data: [
        { tenantId, name: 'AWS', category: 'Cloud Hosting', costCents: 320000, billingCycle: 'MONTHLY', status: 'ACTIVE', nextRenewalAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20) },
        { tenantId, name: 'OpenAI API', category: 'AI / LLM', costCents: 145000, billingCycle: 'MONTHLY', status: 'ACTIVE', nextRenewalAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9) },
        { tenantId, name: 'bizbrain.co.za domain', category: 'Domain', costCents: 25000, billingCycle: 'ANNUAL', status: 'ACTIVE', nextRenewalAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 200) },
        { tenantId, name: 'Figma', category: 'Software', costCents: 90000, billingCycle: 'MONTHLY', status: 'TRIAL', nextRenewalAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5) },
        { tenantId, name: 'Old CRM (legacy)', category: 'Software', costCents: 60000, billingCycle: 'MONTHLY', status: 'CANCELLED', nextRenewalAt: null, notes: 'Replaced by BizBrain' }
      ]
    })
  }

  console.log('Seed-extra complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
