from django.http import JsonResponse
from django.shortcuts import render
from questions.models import Question, MarkQuestion
from users.models import User
from questions.serializers import QuestionSerializer, MarkQuestionSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.forms.models import model_to_dict
from django.db import connection
from django.utils import timezone
from itertools import product

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_questions(request):
    users = list(User.objects.exclude(username='admin').values('id', 'username'))

    sql = """
        SELECT q.q_id, q.name, q.link, u.username AS posted_by 
        FROM questions_question q JOIN users_user u ON q.posted_by_id=u.id 
        WHERE 1 = 1
    """
    params = []

    q_name = request.GET.get('q_name')
    if q_name:
        # using prepared statement
        sql += " AND name LIKE %s"
        params.append(f"%{q_name}%")
    
    sql += " ORDER BY q.posted_time"
    result = []
    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        columns = [col[0] for col in cursor.description]
        results = cursor.fetchall()
        rows = [dict(zip(columns, row)) for row in results]
        for row in rows:
            for user in users:
                marked = MarkQuestion.objects.filter(user_id=user['id'], q_id=row['q_id'])
                if marked:
                    row[user['username']] = marked[0].done
                else:
                    row[user['username']] = False
            result.append(row)
    return JsonResponse({'data': result})

@api_view(['GET'])
def get_mark_questions(request):
    mark_qs = MarkQuestion.objects.all()
    serializer = MarkQuestionSerializer(mark_qs, many=True)
    return JsonResponse({'data': serializer.data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_question(request):
    name = request.data['name']
    link = request.data['link']

    question = Question.objects.create(
        name=name,
        link=link,
        posted_time=timezone.now(),
        posted_by=request.user
    )
    question.save()
    serializer = QuestionSerializer(question)
    return JsonResponse({'data': serializer.data})
    # return JsonResponse({'data': ''} )

