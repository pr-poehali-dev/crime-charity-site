import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления донат-заказами (создание, получение списка, обновление статуса)
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration missing'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        nickname = body_data.get('nickname', '')
        package_name = body_data.get('package_name', '')
        amount = body_data.get('amount', 0)
        
        if not nickname or not package_name or not amount:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing required fields'}),
                'isBase64Encoded': False
            }
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "INSERT INTO donation_orders (nickname, package_name, amount, status) VALUES (%s, %s, %s, %s) RETURNING id, created_at",
                (nickname, package_name, amount, 'pending')
            )
            result = cur.fetchone()
            conn.commit()
        
        conn.close()
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'id': result['id'], 'created_at': result['created_at'].isoformat()}),
            'isBase64Encoded': False
        }
    
    elif method == 'GET':
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT id, nickname, package_name, amount, status, created_at, completed_at FROM donation_orders ORDER BY created_at DESC LIMIT 100"
            )
            orders = cur.fetchall()
        
        conn.close()
        
        orders_list = []
        for order in orders:
            orders_list.append({
                'id': order['id'],
                'nickname': order['nickname'],
                'package_name': order['package_name'],
                'amount': order['amount'],
                'status': order['status'],
                'created_at': order['created_at'].isoformat() if order['created_at'] else None,
                'completed_at': order['completed_at'].isoformat() if order['completed_at'] else None
            })
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'orders': orders_list}),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        order_id = body_data.get('id')
        status = body_data.get('status', 'pending')
        
        if not order_id:
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Order ID required'}),
                'isBase64Encoded': False
            }
        
        completed_at = 'CURRENT_TIMESTAMP' if status == 'completed' else 'NULL'
        
        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE donation_orders SET status = %s, completed_at = {completed_at} WHERE id = %s",
                (status, order_id)
            )
            conn.commit()
        
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
