# posts/views.py

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer
from users.models import Follow

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class NewsFeedView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Encontra todos os usuários que o usuário logado segue
        following_users_ids = self.request.user.following.values_list('followed_id', flat=True)
        
        # Converte o ValuesListQuerySet para uma lista e adiciona o ID do usuário logado
        following_and_self_ids = list(following_users_ids) + [self.request.user.id]

        # Filtra as postagens para incluir as desses usuários e as suas próprias
        queryset = Post.objects.filter(author_id__in=following_and_self_ids).order_by('-created_at')
        return queryset
    
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_id']).order_by('-created_at')

    def perform_create(self, serializer):
        post = get_object_or_404(Post, id=self.kwargs['post_id'])
        serializer.save(author=self.request.user, post=post)

class LikeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        like, created = Like.objects.get_or_create(post=post, author=request.user)
        
        if created:
            return Response({"detail": "Post liked successfully."}, status=status.HTTP_201_CREATED)
        else:
            like.delete()
            return Response({"detail": "Post unliked successfully."}, status=status.HTTP_204_NO_CONTENT)