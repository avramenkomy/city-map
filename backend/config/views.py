from django.conf import settings
from django.http import FileResponse, Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Функция является api_view и принимает GET-запрос
@api_view(['GET'])
def health_check(request):
  return Response({
    'status': 'ok',
    'message': 'Backend is work.'
  })


def frontend_app(request):
    if not settings.FRONTEND_INDEX_FILE.exists():
        raise Http404(
            "Frontend build not found. Run `npm run build` in the frontend directory."
        )

    return FileResponse(
        settings.FRONTEND_INDEX_FILE.open("rb"),
        content_type="text/html",
    )
