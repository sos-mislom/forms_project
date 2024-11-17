from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404

from .dataclasses import FormCreateForm, QuestionCreateForm, AnswerCreateForm
from .models import Form, Answer, Question


def create_or_edit_form(request, form_id=None):
    if form_id:
        form_instance = get_object_or_404(Form, id=form_id)
    else:
        form_instance = None

    questions = Question.objects.filter(form=form_instance) if form_instance else []

    if request.method == 'POST':
        form_form = FormCreateForm(request.POST, instance=form_instance)

        if form_form.is_valid():
            form = form_form.save()

            existing_questions = Question.objects.filter(form=form)
            existing_question_ids = {str(question.id) for question in existing_questions}

            question_ids_from_post = {}

            for key, value in request.POST.items():
                if key.startswith('question-'):

                    question_id = key.split('-')[1]

                    if question_id.isdigit() and question_id in existing_question_ids:
                        question = Question.objects.get(id=question_id, form=form)
                        question.text = value
                    else:
                        question = Question.objects.create(form=form, text=value)
                        question.save()

                    question.save()
                    question_ids_from_post[question_id] = question

            for question in existing_questions:
                if str(question.id) not in question_ids_from_post:
                    question.delete()

            existing_answers = Answer.objects.filter(question__form=form)
            existing_answer_ids = {str(answer.id) for answer in existing_answers}
            answer_ids_from_post = set()

            for answer_key, answer_value in request.POST.items():
                if answer_key.startswith('answer-'):

                    question_id = answer_key.split('-')[1]
                    answer_id = answer_key.split('-')[2]

                    if question_id not in question_ids_from_post:
                        break

                    question = question_ids_from_post[question_id]

                    if answer_id.isdigit() and answer_id in existing_answer_ids:
                        answer = Answer.objects.get(id=answer_id)
                        answer.text = answer_value
                        answer.save()
                    else:
                        answer = Answer.objects.create(question=question, text=answer_value)
                        answer_id = str(answer.id)

                    answer_ids_from_post.add(answer_id)

            for answer in existing_answers:
                if str(answer.id) not in answer_ids_from_post:
                    answer.delete()

            return redirect('forms_list')
        else:
            return JsonResponse({'success': False, 'errors': form_form.errors})

    else:
        form_form = FormCreateForm(instance=form_instance)
        question_form = QuestionCreateForm()
        answer_form = AnswerCreateForm()

    return render(request, 'forms/create_form.html', {
        'form_form': form_form,
        'question_form': question_form,
        'answer_form': answer_form,
        'form_id': form_instance.id if form_instance else None,
        'questions': questions
    })


def forms_list(request):
    forms = Form.objects.all()
    print(forms)
    return render(request, 'forms/forms_list.html', {'forms': forms})


