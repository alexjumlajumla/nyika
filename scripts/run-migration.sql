-- Create a function to execute dynamic SQL safely
CREATE OR REPLACE FUNCTION public.exec_sql(sql text) 
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  EXECUTE sql;
  RETURN json_build_object('status', 'success');
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'status', 'error',
    'message', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
