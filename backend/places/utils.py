def delete_file_if_exists(file_field):
    if not file_field:
        return

    if not file_field.name:
        return

    storage = file_field.storage
    file_name = file_field.name

    if storage.exists(file_name):
        storage.delete(file_name)
