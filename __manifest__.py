# -*- coding: utf-8 -*-
{
    'name': 'ERP Fingerprint Machine',
    'author': "ERP Team",
    'summary': 'ERP Fingerprint Machine',
    'website': 'https://github.com/Phuong2711/erp_internal',
    'license': 'LGPL-3',
    'depends': [],
    'external_dependencies': {'python': ['pyzk']},
    'data': [
        'security/ir.model.access.csv',
        'data/x_machine_data.xml',
        'views/x_machine_views.xml',
        'views/dashboard_views.xml',
        'views/menu.xml',
    ],
    'assets': {
            'web.assets_backend': [
                'erp_internal/static/src/js/dashboard.js',
                'erp_internal/static/src/xml/dashboard.xml',
                'erp_internal/static/src/scss/erp_internal_style.scss',

                                   ],
        },
    'installable': True,
    'application': False,
    'auto_install': False,
}
