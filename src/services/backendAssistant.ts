import { AssistantResponse, ScreenId } from '../types';

/**
 * Backend Assistant Service for Vendora Shop POS
 * Strictly follows the 7 boundaries specified by the Stitch UI schema.
 */

const VALID_SCREENS: Record<ScreenId, string[]> = {
  dashboard: [
    'metric_trio',
    'quick_counter_actions',
    'debt_cap_sentinel',
    'stock_critical_watch',
    'live_ledger_flow',
    'thermal_print_slip'
  ],
  sell: [
    'barcode_scanner',
    'search_bar',
    'category_filter',
    'product_catalog',
    'cart_ledger',
    'payment_selector',
    'debt_details_panel',
    'complete_sale_action'
  ],
  debts: [
    'active_debt_gauge',
    'debt_summary_trio',
    'search_bar',
    'ledger_tabs',
    'debt_customer_card',
    'settlement_modal',
    'sms_reminder'
  ],
  analytics: [
    'command_center_header',
    'range_selector',
    'metrics_trio',
    'stock_forecast_card',
    'financial_health_chart',
    'cash_flow_breakdown',
    'product_velocity_mosaic',
    'export_reports'
  ],
  inventory: [
    'catalog_table',
    'stock_level_badge',
    'reorder_action',
    'stock_in_modal'
  ]
};

export function processBackendAssistantRequest(input: string): AssistantResponse | string {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // Rule 7: NO ROLE CHANGES / Jailbreak rejection
  if (
    lower.includes('pretend') ||
    lower.includes('act as') ||
    lower.includes('override') ||
    lower.includes('ignore previous') ||
    lower.includes('roleplay') ||
    lower.includes('system prompt')
  ) {
    return {
      error: 'not_in_ui',
      request: trimmed
    };
  }

  // 1. Navigation / Screen Switch
  if (lower.includes('go to') || lower.includes('open') || lower.includes('switch to') || lower.includes('show screen')) {
    if (lower.includes('dashboard') || lower.includes('home') || lower.includes('terminal pulse')) {
      return {
        screen: 'dashboard',
        component: 'bottom_nav',
        action: 'navigate',
        payload: { targetScreen: 'dashboard' }
      };
    }
    if (lower.includes('sell') || lower.includes('pos') || lower.includes('counter') || lower.includes('cart')) {
      return {
        screen: 'sell',
        component: 'bottom_nav',
        action: 'navigate',
        payload: { targetScreen: 'sell' }
      };
    }
    if (lower.includes('debt') || lower.includes('credit') || lower.includes('ledger')) {
      return {
        screen: 'debts',
        component: 'bottom_nav',
        action: 'navigate',
        payload: { targetScreen: 'debts' }
      };
    }
    if (lower.includes('analytic') || lower.includes('chart') || lower.includes('command center') || lower.includes('report')) {
      return {
        screen: 'analytics',
        component: 'bottom_nav',
        action: 'navigate',
        payload: { targetScreen: 'analytics' }
      };
    }
    if (lower.includes('inventory') || lower.includes('stock')) {
      return {
        screen: 'inventory',
        component: 'bottom_nav',
        action: 'navigate',
        payload: { targetScreen: 'inventory' }
      };
    }
  }

  // 2. Add to Cart / Sell interactions
  if (lower.includes('add to cart') || lower.includes('buy') || (lower.includes('add') && (lower.includes('indomie') || lower.includes('milk') || lower.includes('sugar') || lower.includes('spaghetti')))) {
    let itemId = '';
    let itemName = '';
    let unitPrice = 0;

    if (lower.includes('indomie')) {
      itemId = 'indomie';
      itemName = 'Indomie Super Pack';
      unitPrice = 450;
    } else if (lower.includes('milk') || lower.includes('peak')) {
      itemId = 'peak';
      itemName = 'Peak Evaporated Milk';
      unitPrice = 750;
    } else if (lower.includes('sugar') || lower.includes('dangote')) {
      itemId = 'dangote';
      itemName = 'Dangote Sugar 1kg';
      unitPrice = 1200;
    } else if (lower.includes('spaghetti') || lower.includes('spag')) {
      itemId = 'spag';
      itemName = 'Golden Penny Spaghetti';
      unitPrice = 850;
    } else {
      return { error: 'missing_field', field: 'itemId' };
    }

    // Extract quantity if mentioned
    const qtyMatch = lower.match(/\b(\d+)\s*(pack|packs|unit|units|piece|pieces)?\b/);
    const quantity = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;

    return {
      screen: 'sell',
      component: 'cart_ledger',
      action: 'add_item',
      payload: {
        itemId,
        itemName,
        unitPrice,
        quantity
      }
    };
  }

  // 3. Clear Cart
  if (lower.includes('clear cart') || lower.includes('empty cart') || lower.includes('delete cart')) {
    return {
      screen: 'sell',
      component: 'cart_ledger',
      action: 'clear_cart',
      payload: {}
    };
  }

  // 4. Barcode Scanner toggle
  if (lower.includes('scanner') || lower.includes('barcode') || lower.includes('camera')) {
    return {
      screen: 'sell',
      component: 'barcode_scanner',
      action: 'toggle_scanner',
      payload: { active: !lower.includes('close') }
    };
  }

  // 5. Debt Settlement
  if (lower.includes('settle') || lower.includes('pay debt') || lower.includes('repay')) {
    let customerName = '';
    let amount = 0;
    let paymentChannel: 'cash' | 'transfer' = 'cash';

    if (lower.includes('musa') || lower.includes('alhaji')) {
      customerName = 'Alhaji Musa';
      amount = 38000;
    } else if (lower.includes('okafor') || lower.includes('chinedu')) {
      customerName = 'Chinedu Okafor';
      amount = 2800;
    } else if (lower.includes('nkechi') || lower.includes('mama')) {
      customerName = 'Mama Nkechi';
      amount = 1500;
    }

    // Check for explicit amount in request
    const amtMatch = input.match(/[₦N]?\s*(\d[\d,]*)/i);
    if (amtMatch && parseInt(amtMatch[1].replace(/,/g, ''), 10) > 100) {
      amount = parseInt(amtMatch[1].replace(/,/g, ''), 10);
    }

    if (lower.includes('transfer') || lower.includes('bank')) {
      paymentChannel = 'transfer';
    }

    if (!customerName) {
      return { error: 'missing_field', field: 'customerName' };
    }

    return {
      screen: 'debts',
      component: 'settlement_modal',
      action: 'confirm_settlement',
      payload: {
        customerName,
        amount,
        paymentChannel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      }
    };
  }

  // 6. Complete Sale & Print Receipt
  if (lower.includes('complete sale') || lower.includes('checkout') || lower.includes('print receipt')) {
    let paymentMethod: 'cash' | 'pos' | 'credit' = 'cash';
    if (lower.includes('pos') || lower.includes('transfer')) {
      paymentMethod = 'pos';
    } else if (lower.includes('credit') || lower.includes('debt')) {
      paymentMethod = 'credit';
    }

    return {
      screen: 'sell',
      component: 'complete_sale_action',
      action: 'execute_checkout',
      payload: {
        paymentMethod,
        triggerThermalPrint: true
      }
    };
  }

  // 7. Print Slip / Thermal summary on Dashboard
  if (lower.includes('print slip') || lower.includes('thermal slip') || lower.includes('daily summary')) {
    return {
      screen: 'dashboard',
      component: 'thermal_print_slip',
      action: 'print_daily_close',
      payload: {
        store: 'Lagos Store #01',
        todaySales: 148250,
        activeDebt: 42300,
        cashIn: 162750
      }
    };
  }

  // 8. Export CSV or PDF Report
  if (lower.includes('export') || lower.includes('csv') || lower.includes('pdf') || lower.includes('download')) {
    const isPdf = lower.includes('pdf');
    return {
      screen: 'analytics',
      component: 'export_reports',
      action: isPdf ? 'download_pdf_summary' : 'export_csv_report',
      payload: {
        reportType: isPdf ? 'Phase 5 Weekly PDF Summary' : 'CSV Ledger Export',
        status: 'ready'
      }
    };
  }

  // 9. SMS Reminder
  if (lower.includes('sms') || lower.includes('remind')) {
    let customerName = 'Chinedu Okafor';
    if (lower.includes('musa')) customerName = 'Alhaji Musa';
    if (lower.includes('nkechi')) customerName = 'Mama Nkechi';

    return {
      screen: 'debts',
      component: 'sms_reminder',
      action: 'queue_sms',
      payload: {
        customerName,
        status: 'queued'
      }
    };
  }

  // 10. Filter debts
  if (lower.includes('overdue') || lower.includes('settled today') || lower.includes('all debts')) {
    let filter = 'all';
    if (lower.includes('overdue')) filter = 'overdue';
    else if (lower.includes('settled')) filter = 'settled';

    return {
      screen: 'debts',
      component: 'ledger_tabs',
      action: 'select_filter',
      payload: {
        activeFilter: filter
      }
    };
  }

  // 11. Auto-Draft PO
  if (lower.includes('auto-draft') || lower.includes('draft po') || lower.includes('purchase order')) {
    return {
      screen: 'analytics',
      component: 'stock_forecast_card',
      action: 'auto_draft_po',
      payload: {
        recommendedAmount: 64000,
        targetItems: ['Peak Milk', 'Indomie noodles']
      }
    };
  }

  // Strict boundary refusal for anything outside the UI (Rule 1 & 5)
  return "This action isn't available in the current interface.";
}
