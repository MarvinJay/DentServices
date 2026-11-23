import React from 'react'

export default function Welcome(){
  return React.createElement('div', { style: { padding: 36, maxWidth: 980, margin: '36px auto' } },
    React.createElement('h1', { style: { fontSize: 34, marginBottom: 12 } }, 'Welcome to Dent Services — US Auto Repair Network'),
    React.createElement('p', { style: { color: '#374151', lineHeight: 1.6 } }, 'We connect vehicle owners and insurance partners with a trusted network of dent, hail and collision repair shops across the United States. Our partners specialize in rapid estimates, quality body work and paint refinishing to bring vehicles back to showroom condition.'),

    React.createElement('h3', { style: { marginTop: 20 } }, 'What we do'),
    React.createElement('ul', { style: { color: '#374151', lineHeight: 1.6 } },
      React.createElement('li', null, 'Fast, accurate digital estimates for hail and collision damage.'),
      React.createElement('li', null, 'Nationwide partner shops offering guaranteed workmanship and OEM-quality parts.'),
      React.createElement('li', null, 'Streamlined claims intake for insurers and direct scheduling for customers.'),
      React.createElement('li', null, 'Specialist services including paintless dent repair, panel replacement, and refinishing.'),
    ),

    React.createElement('h3', { style: { marginTop: 20 } }, 'Why choose partner shops'),
    React.createElement('p', { style: { color: '#374151', lineHeight: 1.6 } }, 'Partner shops are vetted for quality and responsiveness. They provide timely estimates, clear repair timelines, and transparent pricing — saving insurers and customers time and reducing claim cycle length.'),

    React.createElement('div', { style: { marginTop: 20, display: 'flex', gap: 12 } },
      React.createElement('a', { href: '/login/partner', className: 'close-btn' }, 'Sign in as Partner'),
      React.createElement('a', { href: '/login/admin', className: 'close-btn' }, 'Sign in as Admin')
    )
  )
}
