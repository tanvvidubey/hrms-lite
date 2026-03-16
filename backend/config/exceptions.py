from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None and hasattr(response, "data") and isinstance(response.data, dict):
        data = response.data
        message = data.get("message")
        if not message:
            if data.get("detail"):
                detail = data["detail"]
                message = detail[0] if isinstance(detail, list) else detail
            elif data.get("non_field_errors"):
                message = data["non_field_errors"][0] if data["non_field_errors"] else None
            elif not message and data:
                first = next((v for k, v in data.items() if isinstance(v, (list, str)) and v), None)
                if first:
                    message = first[0] if isinstance(first, list) else first
        if message:
            data["message"] = message
    return response
