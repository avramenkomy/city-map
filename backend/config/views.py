from rest_framework.decorators import api_view
from rest_framework.response import Response

# Функция является api_view и принимает GET-запрос
@api_view(['GET'])
def health_check(request):
  return Response({
    'status': 'ok',
    'message': 'Backend is work.'
  })
