import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      recipientEmail,
      schedule,
      startDate,
      endDate,
      totalOrders,
      totalSales,
      completedOrders,
      pendingOrders,
      orders
    } = body

    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'Email penerima wajib diisi' },
        { status: 400 }
      )
    }

    // Generate CSV content
    const headers = [
      'ID Pesanan',
      'Tanggal',
      'Nama Pelanggan',
      'No HP',
      'Alamat',
      'Status',
      'Total',
      'Item Pesanan'
    ]

    const rows = orders.map((order: any) => {
      const items = order.items.map((item: any) => `${item.product.name} (x${item.quantity})`).join('; ')
      return [
        `#${order.id.slice(-6).toUpperCase()}`,
        new Date(order.createdAt).toLocaleString('id-ID'),
        order.userName,
        order.userPhone,
        order.userAddress,
        order.status,
        `Rp ${order.total.toLocaleString('id-ID')}`,
        items
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map((row: string[]) => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const csvBase64 = Buffer.from('\uFEFF' + csvContent).toString('base64')

    // Create HTML email template
    const scheduleText = {
      daily: 'Harian',
      weekly: 'Mingguan',
      monthly: 'Bulanan'
    }[schedule] || 'Custom'

    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Laporan Penjualan</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
              font-size: 14px;
            }
            .content {
              padding: 30px;
            }
            .stats {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            .stat-box {
              background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              border: 2px solid #fed7aa;
            }
            .stat-value {
              font-size: 28px;
              font-weight: bold;
              color: #ea580c;
              margin: 5px 0;
            }
            .stat-label {
              font-size: 12px;
              color: #78716c;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .table th,
            .table td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e7e5e4;
            }
            .table th {
              background-color: #f5f5f4;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .table td {
              font-size: 14px;
            }
            .status-completed {
              color: #16a34a;
              font-weight: 600;
            }
            .status-pending {
              color: #ca8a04;
              font-weight: 600;
            }
            .status-cancelled {
              color: #dc2626;
              font-weight: 600;
            }
            .footer {
              background-color: #f5f5f4;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #78716c;
            }
            .download-btn {
              display: inline-block;
              background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin-bottom: 20px;
            }
            .download-btn:hover {
              background: linear-gradient(135deg, #15803d 0%, #166534 100%);
            }
            @media (max-width: 600px) {
              .stats {
                grid-template-columns: 1fr;
              }
              .table {
                font-size: 12px;
              }
              .table th,
              .table td {
                padding: 8px 4px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Laporan Penjualan</h1>
              <p>Ayam Geprek Sambal Ijo - ${scheduleText}</p>
              <p style="font-size: 12px; margin-top: 5px;">${new Date(startDate).toLocaleDateString('id-ID')} - ${new Date(endDate).toLocaleDateString('id-ID')}</p>
            </div>
            
            <div class="content">
              <div class="stats">
                <div class="stat-box">
                  <div class="stat-value">${totalOrders}</div>
                  <div class="stat-label">Total Pesanan</div>
                </div>
                <div class="stat-box">
                  <div class="stat-value">Rp ${totalSales.toLocaleString('id-ID')}</div>
                  <div class="stat-label">Total Penjualan</div>
                </div>
                <div class="stat-box">
                  <div class="stat-value">${completedOrders}</div>
                  <div class="stat-label">Selesai</div>
                </div>
                <div class="stat-box">
                  <div class="stat-value">${pendingOrders}</div>
                  <div class="stat-label">Pending</div>
                </div>
              </div>

              <a href="data:text/csv;base64,${csvBase64}" download="laporan-penjualan-${new Date().toISOString().split('T')[0]}.csv" class="download-btn">
                📥 Download CSV
              </a>

              <table class="table">
                <thead>
                  <tr>
                    <th>ID Pesanan</th>
                    <th>Tanggal</th>
                    <th>Pelanggan</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.map((order: any) => `
                    <tr>
                      <td>#${order.id.slice(-6).toUpperCase()}</td>
                      <td style="font-size: 12px;">${new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                      <td>
                        <div style="font-weight: 600;">${order.userName}</div>
                        <div style="font-size: 11px; color: #78716c;">${order.userPhone}</div>
                      </td>
                      <td>
                        <span class="status-${order.status}">${order.status}</span>
                      </td>
                      <td style="font-weight: 600;">Rp ${order.total.toLocaleString('id-ID')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px;">
                  <strong>💡 Tips:</strong> Klik tombol "Download CSV" di atas untuk mengunduh data lengkap dalam format Excel.
                </p>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 0;">Generated on ${new Date().toLocaleString('id-ID')}</p>
              <p style="margin: 5px 0 0 0;">Ayam Geprek Sambal Ijo - Sambal Pedas Mantap</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Check if RESEND_API_KEY is available
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (!resendApiKey) {
      console.warn('[Email] RESEND_API_KEY not found. Email service is not configured.')
      // In development, return success without actually sending email
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          success: true,
          message: 'Email simulated (development mode)',
          note: 'Set RESEND_API_KEY environment variable to enable actual email sending'
        })
      }
      
      return NextResponse.json(
        { error: 'Email service not configured. Please contact administrator.' },
        { status: 503 }
      )
    }

    // Send email using Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ayam Geprek Sambal Ijo <musafir2310@gamail.com>',
        to: recipientEmail,
        subject: `📊 Laporan Penjualan ${scheduleText} - ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`,
        html: emailHTML,
      }),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json()
      console.error('[Email] Resend API Error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to send email' },
        { status: resendResponse.status }
      )
    }

    const resendData = await resendResponse.json()
    console.log('[Email] Email sent successfully:', resendData.id)

    return NextResponse.json({
      success: true,
      messageId: resendData.id,
      message: 'Laporan berhasil dikirim'
    })

  } catch (error) {
    console.error('[Email] Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengirim email' },
      { status: 500 }
    )
  }
}
