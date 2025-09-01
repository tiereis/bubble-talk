# users/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .serializers import RegisterSerializer, ProfileSerializer, UserSerializer
from .models import Profile, Follow

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile, created = Profile.objects.get_or_create(user=user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        profile = Profile.objects.get(user=user)
        
        # O DRF precisa de um serializer para processar a requisição
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            # Atualiza apenas os campos do perfil (foto)
            if 'profile_picture' in request.data:
                profile.profile_picture = request.data['profile_picture']
                profile.save()

            # Atualiza o nome de usuário ou e-mail se eles estiverem na requisição
            if 'username' in request.data:
                user.username = request.data['username']
            if 'email' in request.data:
                user.email = request.data['email']
            
            # TODO: Adicione lógica para a senha aqui, se necessário.
            # O ideal é um endpoint separado para segurança.
            
            user.save()
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        user_to_follow = get_object_or_404(User, id=user_id)
        if request.user == user_to_follow:
            return Response({'detail': 'Você não pode seguir a si mesmo.'}, status=status.HTTP_400_BAD_REQUEST)
        
        Follow.objects.get_or_create(follower=request.user, followed=user_to_follow)
        return Response({'detail': 'Usuário seguido com sucesso.'}, status=status.HTTP_201_CREATED)

    def delete(self, request, user_id):
        user_to_unfollow = get_object_or_404(User, id=user_id)
        
        follow_instance = Follow.objects.filter(follower=request.user, followed=user_to_unfollow)
        if not follow_instance.exists():
            return Response({'detail': 'Você não está seguindo este usuário.'}, status=status.HTTP_400_BAD_REQUEST)
        
        follow_instance.delete()
        return Response({'detail': 'Usuário deixou de ser seguido com sucesso.'}, status=status.HTTP_204_NO_CONTENT)

        
class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}