# --- GIAI ĐOẠN 1: BUILD (BUILD STAGE) ---
# Sử dụng image Gradle chính thức có chứa JDK 21 (vì bạn dùng Java 21)
FROM gradle:jdk21 AS build

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Copy các file cấu hình build của Gradle
# (Copy riêng các file này trước để tối ưu Docker cache)
COPY build.gradle.kts settings.gradle.kts ./

# Copy source code
COPY src ./src

# Chạy lệnh Gradle để build ứng dụng
# (bootJar là task của Spring Boot, --no-daemon tốt cho môi trường CI/container)
RUN gradle bootJar --no-daemon

# --- GIAI ĐOẠN 2: RUNTIME (FINAL STAGE) ---
# Sử dụng image JRE (chỉ để chạy) của Amazon Corretto 21
FROM amazoncorretto:21

# Đặt thư mục làm việc
WORKDIR /app

# Copy file .jar đã được build từ Giai đoạn 1
# Vị trí file .jar của Gradle là build/libs/
# Sử dụng * để tự động khớp tên file (ví dụ: watch-together-0.0.1-SNAPSHOT.jar)
COPY --from=build /app/build/libs/*.jar app.jar

# Chỉ định lệnh sẽ chạy khi container khởi động
ENTRYPOINT ["java", "-jar", "app.jar"]