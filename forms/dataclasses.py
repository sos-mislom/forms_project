from django import forms
from .models import Form, Question, Answer

class FormCreateForm(forms.ModelForm):
    class Meta:
        model = Form
        fields = ['title', 'description']

class QuestionCreateForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ['text']

class AnswerCreateForm(forms.ModelForm):
    class Meta:
        model = Answer
        fields = ['text']
